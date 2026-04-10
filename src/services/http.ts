import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/lib/storage';
import { captureException, addBreadcrumb } from '@/lib/sentry';
import { showErrorToast } from '@/components/Toast';
import i18next from 'i18next';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const http = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': 'mobile',
  },
});

const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_COOLDOWN_MS = 30_000;

let consecutiveServerErrors = 0;
let circuitOpenUntil = 0;

type CircuitListener = (degraded: boolean) => void;
const circuitListeners = new Set<CircuitListener>();

function notifyCircuitListeners(degraded: boolean) {
  circuitListeners.forEach((fn) => fn(degraded));
}

function recordServerError() {
  consecutiveServerErrors++;
  if (consecutiveServerErrors >= CIRCUIT_THRESHOLD && Date.now() >= circuitOpenUntil) {
    circuitOpenUntil = Date.now() + CIRCUIT_COOLDOWN_MS;
    addBreadcrumb('circuit-breaker', 'Circuit opened — server appears degraded', {
      errors: consecutiveServerErrors,
    });
    notifyCircuitListeners(true);
    setTimeout(() => {
      notifyCircuitListeners(false);
    }, CIRCUIT_COOLDOWN_MS);
  }
}

function recordSuccess() {
  if (consecutiveServerErrors > 0) {
    consecutiveServerErrors = 0;
    if (Date.now() < circuitOpenUntil) {
      circuitOpenUntil = 0;
      notifyCircuitListeners(false);
    }
  }
}

export function isServerDegraded(): boolean {
  return Date.now() < circuitOpenUntil;
}

export function subscribeCircuit(fn: CircuitListener): () => void {
  circuitListeners.add(fn);
  return () => { circuitListeners.delete(fn); };
}

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

function showGlobalErrorToast(key: string) {
  showErrorToast(i18next.t(key));
}

http.interceptors.response.use(
  (response) => {
    recordSuccess();
    return response;
  },
  async (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      showGlobalErrorToast('errors.networkTimeout');
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 429) {
      const retryAfter = Number(error.response?.headers?.['retry-after']) || 2;
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
      const retryCount = originalRequest._retryCount ?? 0;
      if (retryCount < 2) {
        originalRequest._retryCount = retryCount + 1;
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        return http(originalRequest);
      }
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      recordServerError();
      showGlobalErrorToast('errors.serverError');
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/token/refresh/')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return http(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const { data } = await axios.post(
        `${API_URL}/auth/token/refresh/`,
        {},
        {
          headers: {
            'X-Refresh-Token': refreshToken,
            'X-Client-Type': 'mobile',
          },
        },
      );

      const newAccess = data.access as string;
      const newRefresh = (data.refresh as string) || refreshToken;
      tokenStorage.setTokens(newAccess, newRefresh);
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      try {
        const { wsManager } = await import('@/services/websocket');
        wsManager.reconnectWithNewToken();
      } catch {
        // websocket module may not be loaded yet
      }

      processQueue(null, newAccess);
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      captureException(refreshError, { context: '401_refresh_failure' });
      addBreadcrumb('auth', 'Token refresh failed — logging out');

      const { useAuthStore } = await import('@/features/auth/stores/authStore');
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
