import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AuthStackParams } from '@/navigation/types';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

export function RegisterFooter() {
  const { t } = useTranslation();
  const c = useColors();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  return (
    <View style={s.toggleRow}>
      <Text style={[s.toggleText, { color: c.text.secondary }]}>{t('auth.register.haveAccount')}</Text>
      <Pressable
        onPress={() => navigation.navigate('Login')}
        accessibilityRole="link"
        hitSlop={8}
      >
        <Text style={[s.toggleLink, { color: c.brand.deep }]}>{t('auth.register.signInLink')}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  toggleText: { ...typography.body },
  toggleLink: { ...typography.link },
});
