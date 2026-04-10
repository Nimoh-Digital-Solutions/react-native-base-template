import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, Platform, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Fingerprint } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { tokenStorage } from '@/lib/storage';
import { useBiometric } from '@/hooks/useBiometric';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

export type BiometricTimeoutValue = '5min' | '15min' | 'always' | 'never';

const TIMEOUT_KEY = 'biometric_timeout';
const LAST_BG_KEY = 'biometric_last_bg';

const TIMEOUT_MS: Record<BiometricTimeoutValue, number> = {
  '5min': 5 * 60_000,
  '15min': 15 * 60_000,
  always: 0,
  never: Infinity,
};

function readKv(key: string): string | null {
  try {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItem(key);
  } catch (err) {
    if (__DEV__) console.warn('[BiometricGate] readKv failed:', key, err);
    return null;
  }
}

function writeKv(key: string, value: string) {
  try {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    SecureStore.setItem(key, value);
  } catch (err) {
    if (__DEV__) console.warn('[BiometricGate] writeKv failed:', key, err);
  }
}

export function getBiometricTimeout(): BiometricTimeoutValue {
  const val = readKv(TIMEOUT_KEY);
  if (val === '5min' || val === '15min' || val === 'always' || val === 'never') return val;
  return '5min';
}

export function setBiometricTimeout(t: BiometricTimeoutValue) {
  writeKv(TIMEOUT_KEY, t);
}

function getLastBackground(): number {
  const raw = readKv(LAST_BG_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

function setLastBackground(ts: number) {
  writeKv(LAST_BG_KEY, String(ts));
}

export function BiometricGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const c = useColors();
  const { isBiometricAvailable, authenticate } = useBiometric();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const [locked, setLocked] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  const checkAndPrompt = useCallback(async () => {
    if (!isAuthenticated || !isBiometricAvailable) return;
    if (!tokenStorage.getBiometricEnabled()) return;

    const timeout = getBiometricTimeout();
    if (timeout === 'never') return;

    const elapsed = Date.now() - getLastBackground();
    if (elapsed < TIMEOUT_MS[timeout]) return;

    setLocked(true);
    const ok = await authenticate(t('settings.biometric'));
    if (ok) {
      setLocked(false);
    }
  }, [isAuthenticated, isBiometricAvailable, authenticate, t]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appStateRef.current.match(/active/) && next === 'background') {
        setLastBackground(Date.now());
      }
      if (appStateRef.current.match(/background/) && next === 'active') {
        checkAndPrompt();
      }
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, [checkAndPrompt]);

  const handleRetry = useCallback(async () => {
    const ok = await authenticate(t('settings.biometric'));
    if (ok) setLocked(false);
  }, [authenticate, t]);

  const handleLogout = useCallback(() => {
    setLocked(false);
    logout();
  }, [logout]);

  if (locked) {
    return (
      <View style={[s.overlay, { backgroundColor: c.neutral[50] }]}>
        <View style={[s.iconWrap, { backgroundColor: c.brand.deep + '10' }]}>
          <Fingerprint size={48} color={c.brand.deep} />
        </View>
        <Text style={[s.title, { color: c.text.primary }]}>{t('settings.biometric')}</Text>
        <Text style={[s.subtitle, { color: c.text.secondary }]}>{t('settings.biometricSubtitle')}</Text>
        <Pressable
          onPress={handleRetry}
          style={({ pressed }) => [s.retryBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={s.retryText}>{t('common.tryAgain')}</Text>
        </Pressable>
        <Pressable onPress={handleLogout} style={s.logoutLink}>
          <Text style={s.logoutText}>{t('auth.logout.confirm')}</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.auth.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.brand.deep + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryBtn: {
    backgroundColor: colors.brand.deep,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: spacing['2xl'],
    ...shadows.button,
  },
  retryText: { ...typography.button, color: '#fff' },
  logoutLink: { marginTop: spacing.lg },
  logoutText: { ...typography.link, color: colors.status.error },
});
