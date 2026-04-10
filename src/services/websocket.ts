import { AppState, type AppStateStatus } from 'react-native';
import { tokenStorage } from '@/lib/storage';
import { addBreadcrumb } from '@/lib/sentry';

export type WSEvent = { type: string; [key: string]: unknown };

type Listener = (event: WSEvent) => void;

const BASE_WS_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/^http/, 'ws');

const MIN_RECONNECT_MS = 1_000;
const MAX_RECONNECT_MS = 30_000;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = MIN_RECONNECT_MS;
  private intentionalClose = false;
  private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const token = tokenStorage.getAccess();
    if (!token) return;

    this.intentionalClose = false;
    const url = `${BASE_WS_URL}/ws/user/events/`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectDelay = MIN_RECONNECT_MS;
      this.ws?.send(JSON.stringify({ type: 'auth', token }));
      addBreadcrumb('websocket', 'Connected to WS — auth message sent');
    };

    this.ws.onmessage = (e) => {
      try {
        const event: WSEvent = JSON.parse(e.data);
        this.listeners.forEach((fn) => fn(event));
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onerror = () => {
      // onclose will fire after onerror
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    };

    if (!this.appStateSubscription) {
      this.appStateSubscription = AppState.addEventListener('change', this.handleAppState);
    }
  }

  disconnect() {
    this.intentionalClose = true;
    this.clearReconnect();

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  reconnectWithNewToken() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.connect();
  }

  private scheduleReconnect() {
    this.clearReconnect();
    const delay = this.reconnectDelay;
    addBreadcrumb('websocket', `Reconnecting in ${delay}ms`, { delay });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_MS);
      this.connect();
    }, delay);
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private handleAppState = (state: AppStateStatus) => {
    if (state === 'active' && !this.intentionalClose) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.reconnectDelay = MIN_RECONNECT_MS;
        this.connect();
      }
    }
  };
}

export const wsManager = new WebSocketManager();
