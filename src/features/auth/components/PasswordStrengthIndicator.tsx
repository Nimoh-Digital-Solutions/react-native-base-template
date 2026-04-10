import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

interface Props {
  password: string;
}

type Strength = 'weak' | 'medium' | 'strong';

function getStrength(password: string): Strength {
  if (password.length < 8) return 'weak';

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}

const strengthMeta: Record<Strength, { i18nKey: string; bars: number }> = {
  weak: { i18nKey: 'auth.password.strength.weak', bars: 1 },
  medium: { i18nKey: 'auth.password.strength.medium', bars: 2 },
  strong: { i18nKey: 'auth.password.strength.strong', bars: 3 },
};

export function PasswordStrengthIndicator({ password }: Props) {
  const { t } = useTranslation();
  const c = useColors();

  if (!password) return null;

  const strength = getStrength(password);
  const meta = strengthMeta[strength];
  const barColor =
    strength === 'weak' ? c.password.weak : strength === 'medium' ? c.password.medium : c.password.strong;

  return (
    <View style={s.container}>
      <View style={s.barRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[s.bar, { backgroundColor: i <= meta.bars ? barColor : c.neutral[200] }]}
          />
        ))}
      </View>
      <Text style={[s.label, { color: barColor }]}>{t(meta.i18nKey)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: spacing.sm, gap: spacing.xs },
  barRow: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  label: { ...typography.small },
});
