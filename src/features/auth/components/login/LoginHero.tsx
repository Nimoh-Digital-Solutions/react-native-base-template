import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { AuthLogo } from '../AuthLogo';

type LoginHeroProps = {
  title: string;
  subtitle: string;
};

export function LoginHero({ title, subtitle }: LoginHeroProps) {
  const c = useColors();
  return (
    <View style={s.header}>
      <AuthLogo size="lg" showName />
      <Text style={[s.title, { color: c.text.primary }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[s.subtitle, { color: c.text.secondary }]}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: spacing.xl + 8 },
  title: {
    ...typography.title,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
