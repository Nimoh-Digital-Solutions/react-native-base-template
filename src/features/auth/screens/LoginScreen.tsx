import React, { useEffect, useRef, useState } from 'react';
import { AppState, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { loginSchema } from '@shared/schemas/auth.schema';
import type { LoginInput } from '@shared/schemas/auth.schema';
import type { AuthStackParams } from '@/navigation/types';
import { useLogin } from '../hooks/useLogin';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { tokenStorage } from '@/lib/storage';
import { showErrorToast } from '@/components/Toast';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

import { AuthScreenWrapper } from '../components/AuthScreenWrapper';
import { LoginHero } from '../components/login/LoginHero';
import { LoginForm } from '../components/login/LoginForm';
import { LoginSocialAuth } from '../components/login/LoginSocialAuth';
import { LoginFooter } from '../components/login/LoginFooter';

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;

export function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const login = useLogin();
  const google = useGoogleSignIn();
  const { isOnline } = useNetworkStatus();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(tokenStorage.getRememberMe());
  const [failedAttempts, setFailedAttempts] = useState<number[]>([]);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const passwordRef = useRef<TextInput>(null);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email_or_username: '', password: '' },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' && !tokenStorage.getRememberMe()) {
        tokenStorage.clearAll();
      }
    });
    return () => subscription.remove();
  }, []);

  const isRateLimited = cooldownSeconds > 0;

  function recordFailedAttempt() {
    const now = Date.now();
    const recent = [...failedAttempts, now].filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    setFailedAttempts(recent);

    if (recent.length >= MAX_ATTEMPTS) {
      setCooldownSeconds(60);
      cooldownTimer.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            if (cooldownTimer.current) clearInterval(cooldownTimer.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    tokenStorage.setRememberMe(rememberMe);
    login.mutate(data, {
      onSuccess: () => {
        setFailedAttempts([]);
      },
      onError: () => {
        recordFailedAttempt();
        showErrorToast(t('auth.login.invalidCredentials'));
      },
    });
  });

  return (
    <AuthScreenWrapper>
      <LoginHero title={t('auth.login.title')} subtitle={t('auth.login.welcomeBack', { appName: t('app.name') })} />

      <LoginForm
        control={control}
        errors={errors}
        passwordRef={passwordRef}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        rememberMe={rememberMe}
        onToggleRememberMe={() => setRememberMe(!rememberMe)}
        rememberMeLabel={t('auth.login.rememberMe')}
        showPasswordLabel={t('common.showPassword')}
        hidePasswordLabel={t('common.hidePassword')}
        emailPlaceholder={t('auth.login.emailPlaceholder')}
        passwordPlaceholder={t('auth.login.passwordPlaceholder')}
        emailAccessibilityLabel={t('auth.login.emailPlaceholder')}
        passwordAccessibilityLabel={t('auth.login.passwordPlaceholder')}
        onForgotPasswordPress={() => navigation.navigate('ForgotPassword')}
        forgotPasswordLabel={t('auth.login.forgotPassword')}
        isRateLimited={isRateLimited}
        rateLimitMessage={t('auth.login.rateLimitCooldown', { seconds: cooldownSeconds })}
        onSubmit={onSubmit}
        isOnline={isOnline}
        loginPending={login.isPending}
        signInLabel={t('auth.login.signInButton')}
        loadingLabel={t('common.loading')}
        offlineMessage={t('errors.offline')}
      />

      <LoginSocialAuth
        dividerLabel={t('auth.login.orContinueWith')}
        googleLabel={t('auth.login.continueWithGoogle')}
        googleDisabled={google.isPending}
        onGooglePress={async () => {
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
        }}
      />

      <LoginFooter
        noAccountText={t('auth.login.noAccount')}
        createAccountLabel={t('auth.login.createAccount')}
        onRegisterPress={() => navigation.navigate('Register')}
      />
    </AuthScreenWrapper>
  );
}
