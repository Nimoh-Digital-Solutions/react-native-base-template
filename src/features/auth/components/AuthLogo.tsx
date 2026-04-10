import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

const logoSource = require('../../../../assets/icon.png');

type AuthLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
};

const sizes = { sm: 48, md: 72, lg: 96 } as const;

export function AuthLogo({ size = 'md', showName = false }: AuthLogoProps) {
  const c = useColors();
  const { t } = useTranslation();
  const dim = sizes[size];
  const appName = t('app.name', { defaultValue: 'App' });

  return (
    <View style={s.wrap}>
      <View style={[s.logoContainer, { width: dim, height: dim, borderRadius: 12 }]}>
        <Image
          source={logoSource}
          style={{ width: dim, height: dim, borderRadius: 12 }}
          resizeMode="contain"
          accessibilityLabel={`${appName} logo`}
        />
      </View>
      {showName && (
        <Text style={[s.appName, { color: c.text.primary }]}>{appName}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center' },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
});
