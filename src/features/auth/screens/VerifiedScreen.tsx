import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AuthStackParams } from '@/navigation/types';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { AuthScreenWrapper } from '../components/AuthScreenWrapper';
import { AuthButton } from '../components/AuthButton';

export function VerifiedScreen() {
  const c = useColors();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const route = useRoute<RouteProp<AuthStackParams, 'Verified'>>();

  const status = route.params?.status;

  const outcome = useMemo(() => {
    if (status === 'already_verified') {
      return {
        kind: 'error' as const,
        message: t('auth.verified.alreadyVerified'),
      };
    }
    if (status === 'expired_or_invalid') {
      return {
        kind: 'error' as const,
        message: t('auth.verified.expiredOrInvalid'),
      };
    }
    if (status === 'error' || status === 'invalid') {
      return {
        kind: 'error' as const,
        message: t('auth.verified.invalidLink'),
      };
    }
    return {
      kind: 'success' as const,
      message: t('auth.verified.successMessage', {
        defaultValue: 'Your email has been verified. You can sign in now.',
      }),
    };
  }, [status, t]);

  if (outcome.kind === 'error') {
    return (
      <AuthScreenWrapper scrollable={false}>
        <View style={s.content}>
          <View style={[s.iconCircle, { backgroundColor: c.status.warningBg }]}>
            <AlertTriangle size={32} color={c.status.errorDark} />
          </View>
          <Text style={[s.title, { color: c.text.primary }]}>{t('auth.verified.errorTitle')}</Text>
          <Text style={[s.desc, { color: c.text.secondary }]}>{outcome.message}</Text>
          <AuthButton
            label={t('auth.verifyEmail.goToLogin')}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </AuthScreenWrapper>
    );
  }

  return (
    <AuthScreenWrapper scrollable={false}>
      <View style={s.content}>
        <View style={[s.iconCircle, { backgroundColor: c.status.successBg }]}>
          <CheckCircle2 size={36} color={c.status.successDark} />
        </View>
        <Text style={[s.title, { color: c.text.primary }]}>{t('auth.verified.successTitle', { defaultValue: 'Verified' })}</Text>
        <Text style={[s.desc, { color: c.text.secondary }]}>{outcome.message}</Text>
        <AuthButton
          label={t('auth.verifyEmail.goToLogin')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </AuthScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.title,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  desc: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
