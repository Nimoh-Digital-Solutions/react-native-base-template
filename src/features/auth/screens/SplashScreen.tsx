import React, { useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokenStorage } from '@/lib/storage';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

export function SplashScreen() {
  const c = useColors();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const appName = t('app.name', { defaultValue: 'App' });

  const hydrate = useCallback(async () => {
    try {
      const accessToken = tokenStorage.getAccess();
      const refreshToken = tokenStorage.getRefresh();

      if (!accessToken || !refreshToken) {
        setHydrated();
        return;
      }

      try {
        const user = await authApi.getMe();
        useAuthStore.setState({ user, isAuthenticated: true });
      } catch {
        try {
          const refreshed = await authApi.refreshToken(refreshToken);
          tokenStorage.setTokens(refreshed.access_token, refreshed.refresh_token);
          const user = await authApi.getMe();
          useAuthStore.setState({ user, isAuthenticated: true });
        } catch {
          logout();
        }
      }
    } catch {
      logout();
    } finally {
      setHydrated();
    }
  }, [logout, setHydrated]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <View style={[s.container, { backgroundColor: c.neutral[50] }]}>
      <Text style={[s.appName, { color: c.text.primary }]} accessibilityRole="header">
        {appName}
      </Text>
      <Text style={[s.tagline, { color: c.text.secondary }]}>
        {t('splash.loading', { defaultValue: 'Loading…' })}
      </Text>
      <ActivityIndicator size="large" color={c.brand.deep} style={s.spinner} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 15,
    marginBottom: spacing.xl,
  },
  spinner: { marginTop: spacing.md },
});
