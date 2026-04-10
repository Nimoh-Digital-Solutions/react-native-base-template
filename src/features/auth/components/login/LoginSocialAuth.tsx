import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SocialAuthButton } from '../SocialAuthButton';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

type LoginSocialAuthProps = {
  dividerLabel: string;
  googleLabel: string;
  googleDisabled: boolean;
  onGooglePress: () => void;
};

export function LoginSocialAuth({
  dividerLabel,
  googleLabel,
  googleDisabled,
  onGooglePress,
}: LoginSocialAuthProps) {
  const c = useColors();
  return (
    <>
      <View style={s.dividerRow}>
        <View style={[s.dividerLine, { backgroundColor: c.border.default }]} />
        <Text style={[s.dividerText, { color: c.text.placeholder }]}>{dividerLabel}</Text>
        <View style={[s.dividerLine, { backgroundColor: c.border.default }]} />
      </View>

      <SocialAuthButton
        provider="google"
        label={googleLabel}
        disabled={googleDisabled}
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
