import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

type LoginForgotPasswordLinkProps = {
  label: string;
  onPress: () => void;
};

export function LoginForgotPasswordLink({ label, onPress }: LoginForgotPasswordLinkProps) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={8}>
      <Text style={[s.forgotLink, { color: c.brand.deep }]}>{label}</Text>
    </Pressable>
  );
}

type LoginFooterProps = {
  noAccountText: string;
  createAccountLabel: string;
  onRegisterPress: () => void;
};

export function LoginFooter({ noAccountText, createAccountLabel, onRegisterPress }: LoginFooterProps) {
  const c = useColors();
  return (
    <View style={s.toggleRow}>
      <Text style={[s.toggleText, { color: c.text.secondary }]}>{noAccountText}</Text>
      <Pressable onPress={onRegisterPress} accessibilityRole="link" hitSlop={8}>
        <Text style={[s.toggleLink, { color: c.brand.deep }]}>{createAccountLabel}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  forgotLink: { ...typography.small, fontWeight: '600' },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  toggleText: { ...typography.body },
  toggleLink: { ...typography.link },
});
