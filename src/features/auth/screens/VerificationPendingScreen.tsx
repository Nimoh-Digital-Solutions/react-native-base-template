import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle2, Mail } from 'lucide-react-native';

import type { AuthStackParams } from '@/navigation/types';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { AuthScreenWrapper } from '../components/AuthScreenWrapper';
import { AuthButton } from '../components/AuthButton';

export function VerificationPendingScreen() {
  const c = useColors();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const route = useRoute<RouteProp<AuthStackParams, 'VerificationPending'>>();

  const email = route.params?.email ?? '';

  return (
    <AuthScreenWrapper scrollable={false}>
      <View style={s.content}>
        <View style={[s.iconCircle, { backgroundColor: c.status.successBg }]}>
          <CheckCircle2 size={36} color={c.status.successDark} />
        </View>

        <Text style={[s.title, { color: c.text.primary }]} accessibilityRole="header">
          {t('auth.verifyEmail.title')}
        </Text>
        <Text style={[s.subtitle, { color: c.text.secondary }]}>{t('auth.verifyEmail.subtitle')}</Text>

        {email ? (
          <View
            style={[s.emailPill, { backgroundColor: c.surface.white, borderColor: c.border.default }]}
          >
            <Mail size={16} color={c.text.secondary} />
            <Text style={[s.emailText, { color: c.text.primary }]} numberOfLines={1}>
              {email}
            </Text>
          </View>
        ) : null}

        <Text style={[s.instructions, { color: c.text.secondary }]}>
          {t('auth.verifyEmail.instructions')}
        </Text>

        <AuthButton
          label={t('auth.verifyEmail.goToLogin')}
          onPress={() => navigation.navigate('Login')}
        />

        <Text style={[s.spamHint, { color: c.text.secondary }]}>
          {t('auth.verifyEmail.noEmail')}{' '}
          <Text style={s.spamHintItalic}>{t('auth.verifyEmail.checkSpam')}</Text>
        </Text>
      </View>
    </AuthScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
    alignItems: 'center',
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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    width: '100%',
    marginBottom: spacing.lg,
  },
  emailText: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },

  instructions: {
    ...typography.small,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  spamHint: {
    ...typography.small,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  spamHintItalic: { fontStyle: 'italic' },
});
