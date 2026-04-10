import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { spacing, radius, typography, shadows } from '@/constants/theme';
import type { AuthStackParams } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParams>;

export function WelcomeScreen() {
  const nav = useNavigation<Nav>();
  const c = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const appName = t('app.name', { defaultValue: 'App' });
  const tagline = t('welcome.tagline', { defaultValue: 'Welcome. Sign in or create an account to get started.' });

  return (
    <View style={[s.container, { backgroundColor: c.neutral[50], paddingTop: insets.top }]}>
      <View style={s.hero}>
        <View style={[s.logoCircle, { backgroundColor: c.brand.deep }]}>
          <Text style={s.logoText}>{appName.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={[s.title, { color: c.text.primary }]}>{appName}</Text>
        <Text style={[s.subtitle, { color: c.text.secondary }]}>{tagline}</Text>
      </View>

      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
        <Pressable
          style={[s.button, s.primaryBtn, { backgroundColor: c.brand.deep }, shadows.button]}
          onPress={() => nav.navigate('Login')}
          accessibilityRole="button"
        >
          <Text style={s.primaryBtnText}>
            {t('welcome.signIn', { defaultValue: 'Sign In' })}
          </Text>
        </Pressable>

        <Pressable
          style={[s.button, s.secondaryBtn, { borderColor: c.brand.deep }]}
          onPress={() => nav.navigate('Register')}
          accessibilityRole="button"
        >
          <Text style={[s.secondaryBtnText, { color: c.brand.deep }]}>
            {t('welcome.createAccount', { defaultValue: 'Create Account' })}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    maxWidth: 280,
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  button: {
    height: 52,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtn: {},
  primaryBtnText: {
    color: '#fff',
    ...typography.button,
  },
  secondaryBtn: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryBtnText: {
    ...typography.button,
  },
});
