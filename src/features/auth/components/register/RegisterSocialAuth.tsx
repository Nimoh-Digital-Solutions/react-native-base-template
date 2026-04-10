import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SocialAuthButton } from '../SocialAuthButton';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

type RegisterSocialAuthProps = {
  googlePending: boolean;
  onGooglePress: () => void | Promise<void>;
};

export function RegisterSocialAuth({ googlePending, onGooglePress }: RegisterSocialAuthProps) {
  const { t } = useTranslation();
  const c = useColors();

  return (
    <>
      <View style={s.dividerRow}>
        <View style={[s.dividerLine, { backgroundColor: c.border.default }]} />
        <Text style={[s.dividerText, { color: c.text.placeholder }]}>
          {t('auth.login.orContinueWith')}
        </Text>
        <View style={[s.dividerLine, { backgroundColor: c.border.default }]} />
      </View>

      <SocialAuthButton
        provider="google"
        label={t('auth.register.continueWithGoogle')}
        disabled={googlePending}
        onPress={onGooglePress}
      />
    </>
  );
}

const s = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { ...typography.small },
});
