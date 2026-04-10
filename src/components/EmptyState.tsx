import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

interface Props {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  const c = useColors();
  return (
    <View style={s.container}>
      {icon && <View style={s.iconWrap}>{icon}</View>}
      <Text style={[s.title, { color: c.text.primary }]} accessibilityRole="header">{title}</Text>
      {message && <Text style={[s.message, { color: c.text.secondary }]}>{message}</Text>}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [s.btn, { backgroundColor: c.brand.deep }, pressed && s.btnPressed]}
          accessibilityRole="button"
        >
          <Text style={[s.btnText, { color: c.text.inverse }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing['2xl'] },
  iconWrap: { marginBottom: spacing.md },
  title: { ...typography.title, fontSize: 20, color: colors.text.primary, marginBottom: spacing.xs, textAlign: 'center' },
  message: { ...typography.body, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.lg },
  btn: {
    backgroundColor: colors.brand.deep, borderRadius: radius.md, paddingVertical: 12,
    paddingHorizontal: spacing.lg, ...shadows.button,
  },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { ...typography.button },
});
