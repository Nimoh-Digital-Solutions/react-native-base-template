import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// MMKV is faster (synchronous) but requires native modules — unavailable in Expo Go.
// We try to load it at startup; production EAS builds will succeed, Expo Go will fall back.
let mmkvInstance: import('react-native-mmkv').MMKV | null = null;
if (Platform.OS !== 'web') {
  try {
    // Sync optional native dep — ESM would run before try/catch can handle missing native module in Expo Go.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MMKV } = require('react-native-mmkv');
    mmkvInstance = new MMKV({ id: 'app-query-cache' });
  } catch {
    // Expo Go — MMKV unavailable, will use AsyncStorage below
  }
}

export const usesMmkv = mmkvInstance !== null;

/**
 * Platform-aware key-value storage.
 * - iOS / Android: expo-secure-store (hardware-encrypted keychain)
 * - Web: sessionStorage for tokens (cleared on tab close, not XSS-persistent)
 */
const kv = {
  get(key: string): string | null {
    if (Platform.OS === 'web') {
      return sessionStorage.getItem(key);
    }
    return SecureStore.getItem(key);
  },
  set(key: string, value: string) {
    if (Platform.OS === 'web') {
      sessionStorage.setItem(key, value);
    } else {
      SecureStore.setItem(key, value);
    }
  },
  remove(key: string) {
    if (Platform.OS === 'web') {
      sessionStorage.removeItem(key);
    } else {
      SecureStore.deleteItemAsync(key);
    }
  },
};

const Keys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const;

export const tokenStorage = {
  getAccess: (): string | undefined => kv.get(Keys.ACCESS_TOKEN) ?? undefined,

  getRefresh: (): string | undefined => kv.get(Keys.REFRESH_TOKEN) ?? undefined,

  setTokens: (accessToken: string, refreshToken: string) => {
    kv.set(Keys.ACCESS_TOKEN, accessToken);
    kv.set(Keys.REFRESH_TOKEN, refreshToken);
  },

  clearAll: () => {
    kv.remove(Keys.ACCESS_TOKEN);
    kv.remove(Keys.REFRESH_TOKEN);
  },

  getRememberMe: (): boolean => kv.get(Keys.REMEMBER_ME) !== 'false',

  setRememberMe: (value: boolean) => {
    kv.set(Keys.REMEMBER_ME, String(value));
  },

  getBiometricEnabled: (): boolean => kv.get(Keys.BIOMETRIC_ENABLED) === 'true',

  setBiometricEnabled: (value: boolean) => {
    kv.set(Keys.BIOMETRIC_ENABLED, String(value));
  },
};

// Sync storage used when MMKV is available (production EAS builds)
export const syncQueryStorage = mmkvInstance
  ? {
      getItem: (key: string): string | null => mmkvInstance!.getString(key) ?? null,
      setItem: (key: string, value: string) => mmkvInstance!.set(key, value),
      removeItem: (key: string) => mmkvInstance!.delete(key),
    }
  : null;

// Async fallback for Expo Go / web (query cache is non-sensitive, use localStorage)
export const asyncQueryStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await AsyncStorage.removeItem(key);
  },
};
