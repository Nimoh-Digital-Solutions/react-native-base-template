import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Check, Mail, Lock } from 'lucide-react-native';

import type { LoginInput } from '@shared/schemas/auth.schema';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { AuthInput } from '../AuthInput';
import { AuthButton } from '../AuthButton';
import { LoginForgotPasswordLink } from './LoginFooter';

type LoginFormProps = {
  control: Control<LoginInput>;
  errors: FieldErrors<LoginInput>;
  passwordRef: React.RefObject<any>;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  rememberMe: boolean;
  onToggleRememberMe: () => void;
  rememberMeLabel: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  emailAccessibilityLabel: string;
  passwordAccessibilityLabel: string;
  onForgotPasswordPress: () => void;
  forgotPasswordLabel: string;
  isRateLimited: boolean;
  rateLimitMessage: string;
  onSubmit: () => void;
  isOnline: boolean;
  loginPending: boolean;
  signInLabel: string;
  loadingLabel: string;
  offlineMessage: string;
};

export function LoginForm({
  control,
  errors,
  passwordRef,
  showPassword,
  onToggleShowPassword,
  rememberMe,
  onToggleRememberMe,
  rememberMeLabel,
  showPasswordLabel,
  hidePasswordLabel,
  emailPlaceholder,
  passwordPlaceholder,
  emailAccessibilityLabel,
  passwordAccessibilityLabel,
  onForgotPasswordPress,
  forgotPasswordLabel,
  isRateLimited,
  rateLimitMessage,
  onSubmit,
  isOnline,
  loginPending,
  signInLabel,
  loadingLabel,
  offlineMessage,
}: LoginFormProps) {
  const c = useColors();
  const submitDisabled = !isOnline || loginPending || isRateLimited;

  return (
    <>
      <Controller
        control={control}
        name="email_or_username"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            label={emailPlaceholder}
            icon={Mail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.email_or_username?.message}
            accessibilityLabel={emailAccessibilityLabel}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            ref={passwordRef}
            label={passwordPlaceholder}
            icon={Lock}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
            accessibilityLabel={passwordAccessibilityLabel}
            rightAction={{
              label: showPassword ? hidePasswordLabel : showPasswordLabel,
              onPress: onToggleShowPassword,
            }}
          />
        )}
      />

      <View style={s.optionsRow}>
        <Pressable
          onPress={onToggleRememberMe}
          style={s.checkboxRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
          accessibilityLabel={rememberMeLabel}
        >
          <View
            style={[
              s.checkbox,
              rememberMe
                ? { backgroundColor: c.brand.deep, borderColor: c.brand.deep }
                : { borderColor: c.border.default },
            ]}
          >
            {rememberMe && <Check size={14} color={c.text.inverse} />}
          </View>
          <Text style={[s.checkboxLabel, { color: c.text.secondary }]}>{rememberMeLabel}</Text>
        </Pressable>

        <LoginForgotPasswordLink label={forgotPasswordLabel} onPress={onForgotPasswordPress} />
      </View>

      {isRateLimited && (
        <View style={[s.errorBanner, { backgroundColor: c.status.errorBg }]}>
          <Text style={[s.errorBannerText, { color: c.status.error }]}>{rateLimitMessage}</Text>
        </View>
      )}

      <AuthButton
        label={loginPending ? loadingLabel : signInLabel}
        onPress={onSubmit}
        disabled={submitDisabled}
        loading={loginPending}
      />

      {!isOnline && (
        <Text style={[s.offlineHint, { color: c.status.error }]}>{offlineMessage}</Text>
      )}
    </>
  );
}

const s = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    borderRadius: radius.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: { ...typography.small, color: colors.text.secondary },

  errorBanner: {
    backgroundColor: colors.status.errorBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: { color: colors.status.error, ...typography.small, textAlign: 'center' },

  offlineHint: {
    color: colors.status.error,
    ...typography.small,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
