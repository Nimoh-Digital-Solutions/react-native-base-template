import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { User, Mail, Lock, AtSign } from 'lucide-react-native';

import type { RegisterBaseInput } from '@shared/schemas/auth.schema';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { AuthInput } from '../AuthInput';
import { AuthButton } from '../AuthButton';
import { colors, typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

type RegisterFormProps = {
  control: Control<RegisterBaseInput>;
  errors: FieldErrors<RegisterBaseInput>;
  watchPassword: string;
  usernameRef: React.RefObject<any>;
  lastNameRef: React.RefObject<any>;
  emailRef: React.RefObject<any>;
  passwordRef: React.RefObject<any>;
  confirmPasswordRef: React.RefObject<any>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  onSubmit: () => void;
  isOnline: boolean;
  isRegisterPending: boolean;
};

export function RegisterForm({
  control,
  errors,
  watchPassword,
  usernameRef,
  lastNameRef,
  emailRef,
  passwordRef,
  confirmPasswordRef,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  isOnline,
  isRegisterPending,
}: RegisterFormProps) {
  const { t } = useTranslation();
  const c = useColors();

  return (
    <>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            ref={usernameRef}
            label={t('auth.register.username')}
            icon={AtSign}
            placeholder="johndoe"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.username?.message}
            accessibilityLabel={t('auth.register.username')}
          />
        )}
      />

      <View style={s.nameRow}>
        <View style={s.halfField}>
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label={t('auth.register.firstName')}
                icon={User}
                placeholder="First"
                autoComplete="given-name"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.first_name?.message}
                accessibilityLabel={t('auth.register.firstName')}
              />
            )}
          />
        </View>

        <View style={s.halfField}>
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                ref={lastNameRef}
                label={t('auth.register.lastName')}
                placeholder="Last"
                autoComplete="family-name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.last_name?.message}
                accessibilityLabel={t('auth.register.lastName')}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            ref={emailRef}
            label={t('auth.register.email')}
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
            error={errors.email?.message}
            accessibilityLabel={t('auth.register.email')}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            ref={passwordRef}
            label={t('auth.register.password')}
            icon={Lock}
            placeholder="Min. 8 characters"
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
            accessibilityLabel={t('auth.register.password')}
            rightAction={{
              label: showPassword ? t('common.hidePassword') : t('common.showPassword'),
              onPress: () => setShowPassword(!showPassword),
            }}
          />
        )}
      />
      <View style={s.strengthWrap}>
        <PasswordStrengthIndicator password={watchPassword} />
      </View>

      <Controller
        control={control}
        name="password_confirm"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthInput
            ref={confirmPasswordRef}
            label={t('auth.register.confirmPassword')}
            icon={Lock}
            placeholder="Re-enter password"
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password_confirm?.message}
            accessibilityLabel={t('auth.register.confirmPassword')}
            rightAction={{
              label: showConfirmPassword ? t('common.hidePassword') : t('common.showPassword'),
              onPress: () => setShowConfirmPassword(!showConfirmPassword),
            }}
          />
        )}
      />

      <AuthButton
        label={isRegisterPending ? t('common.loading') : t('auth.register.createAccount')}
        onPress={onSubmit}
        disabled={!isOnline || isRegisterPending}
        loading={isRegisterPending}
      />

      {!isOnline && (
        <Text style={[s.offlineHint, { color: c.status.error }]}>{t('errors.offline')}</Text>
      )}
    </>
  );
}

const s = StyleSheet.create({
  nameRow: { flexDirection: 'row', gap: spacing.sm },
  halfField: { flex: 1 },
  strengthWrap: { marginTop: -spacing.sm, marginBottom: spacing.xs },
  offlineHint: {
    color: colors.status.error,
    ...typography.small,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
