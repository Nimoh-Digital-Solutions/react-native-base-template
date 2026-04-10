import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerBaseSchema } from '@shared/schemas/auth.schema';
import type { RegisterBaseInput } from '@shared/schemas/auth.schema';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/types';
import { useRegister } from '../hooks/useRegister';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { showSuccessToast, showErrorToast } from '@/components/Toast';

import { AuthScreenWrapper } from '../components/AuthScreenWrapper';
import { RegisterFooter } from '../components/register/RegisterFooter';
import { RegisterForm } from '../components/register/RegisterForm';
import { RegisterHero } from '../components/register/RegisterHero';
import { RegisterSocialAuth } from '../components/register/RegisterSocialAuth';

export function RegisterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const register = useRegister();
  const google = useGoogleSignIn();
  const { isOnline } = useNetworkStatus();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const usernameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterBaseInput>({
    resolver: zodResolver(registerBaseSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
    },
  });

  const watchPassword = watch('password');

  const onSubmit = handleSubmit(async (data) => {
    register.mutate(data, {
      onSuccess: () => {
        showSuccessToast(t('auth.register.success'));
        navigation.navigate('VerificationPending', { email: data.email });
      },
      onError: (error: any) => {
        const detail = error?.response?.data;
        if (detail?.email) {
          setError('email', { message: t('auth.register.emailExists') });
        } else if (detail?.username) {
          const msg = Array.isArray(detail.username) ? detail.username[0] : detail.username;
          setError('username', { message: msg });
        } else {
          showErrorToast(t('errors.unknown'));
        }
      },
    });
  });

  async function handleGooglePress() {
    const result = await google.signIn();
    if (!result.success && result.error !== 'cancelled') {
      const msg =
        result.error === 'unavailable'
          ? t('auth.login.googleUnavailable')
          : result.error === 'google_not_configured'
            ? t('auth.login.googleNotConfigured')
            : result.error === 'play_services'
              ? t('auth.login.googlePlayServicesRequired')
              : t('errors.unknown');
      showErrorToast(msg);
    }
  }

  return (
    <AuthScreenWrapper>
      <RegisterHero />
      <RegisterForm
        control={control}
        errors={errors}
        watchPassword={watchPassword}
        usernameRef={usernameRef}
        lastNameRef={lastNameRef}
        emailRef={emailRef}
        passwordRef={passwordRef}
        confirmPasswordRef={confirmPasswordRef}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        onSubmit={onSubmit}
        isOnline={isOnline}
        isRegisterPending={register.isPending}
      />
      <RegisterSocialAuth googlePending={google.isPending} onGooglePress={handleGooglePress} />
      <RegisterFooter />
    </AuthScreenWrapper>
  );
}
