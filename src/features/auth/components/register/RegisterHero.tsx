import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';
import { AuthLogo } from '../AuthLogo';

export function RegisterHero() {
  const { t } = useTranslation();
  const c = useColors();

  return (
    <View style={s.header}>
      <AuthLogo size="lg" showName />
      <Text style={[s.title, { color: c.text.primary }]} accessibilityRole="header">
        {t('auth.register.title')}
      </Text>
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
});
