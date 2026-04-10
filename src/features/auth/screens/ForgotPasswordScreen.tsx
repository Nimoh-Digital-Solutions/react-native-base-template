import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { forgotPasswordSchema } from '@shared/schemas/auth.schema';
import type { ForgotPasswordInput } from '@shared/schemas/auth.schema';
import type { AuthStackParams } from '@/navigation/types';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { Mail, ArrowLeft } from 'lucide-react-native';

import { AuthScreenWrapper } from '../components/AuthScreenWrapper';
import { AuthLogo } from '../components/AuthLogo';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';

export function ForgotPasswordScreen() {
  const c = useColors();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const forgotPassword = useForgotPassword();
  const { isOnline } = useNetworkStatus();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    forgotPassword.mutate(data, {
      onSettled: () => setSubmitted(true),
    });
  });

  return (
    <AuthScreenWrapper>
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={s.backBtn}
        accessibilityRole="link"
        hitSlop={8}
      >
        <View style={s.backBtnRow}>
          <ArrowLeft size={20} color={c.brand.deep} />
          <Text style={[s.backBtnText, { color: c.brand.deep }]}>
            {t('auth.forgotPassword.backToSignIn')}
          </Text>
        </View>
      </Pressable>

      <View style={s.logoRow}>
        <AuthLogo size="md" />
      </View>

      {submitted ? (
        <View style={s.successContainer}>
          <View style={[s.successMail, { backgroundColor: c.status.successBg }]}>
            <Mail size={36} color={c.status.successDark} />
          </View>
          <Text style={[s.successTitle, { color: c.text.primary }]} accessibilityRole="header">
            {t('auth.forgotPassword.checkEmail', { defaultValue: 'Check your email' })}
          </Text>
          <Text style={[s.successBody, { color: c.text.secondary }]}>
            {t('auth.forgotPassword.confirmationMessage')}
          </Text>
          <AuthButton
            label={t('auth.forgotPassword.backToSignIn')}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      ) : (
        <>
          <Text style={[s.title, { color: c.text.heading }]} accessibilityRole="header">
            {t('auth.forgotPassword.title')}
          </Text>
          <Text style={[s.description, { color: c.text.secondary }]}>
            {t('auth.forgotPassword.description')}
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label={t('auth.forgotPassword.emailPlaceholder')}
                icon={Mail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
                accessibilityLabel={t('auth.forgotPassword.emailPlaceholder')}
              />
            )}
          />

          <AuthButton
            label={forgotPassword.isPending ? t('common.loading') : t('auth.forgotPassword.submit')}
            onPress={onSubmit}
            disabled={!isOnline || forgotPassword.isPending}
            loading={forgotPassword.isPending}
          />

          {!isOnline && (
            <Text style={[s.offlineHint, { color: c.status.error }]}>{t('errors.offline')}</Text>
          )}
        </>
      )}
    </AuthScreenWrapper>
  );
}

const s = StyleSheet.create({
  backBtn: { marginBottom: spacing.lg, minHeight: 44, justifyContent: 'center' },
  backBtnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  backBtnText: { ...typography.link },

  logoRow: { alignItems: 'center', marginBottom: spacing.lg },

  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.subtitle,
    marginBottom: spacing.lg,
  },

  offlineHint: { ...typography.small, textAlign: 'center' },

  successContainer: { alignItems: 'center', paddingTop: spacing.lg },
  successMail: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.title,
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  successBody: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
