import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, useIsDark } from '@/hooks/useColors';
import { typography, spacing, radius } from '@/constants/theme';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline';
};

export function AuthButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: AuthButtonProps) {
  const c = useColors();
  const isDark = useIsDark();
  const isDisabled = disabled || loading;

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          s.btn,
          s.outlineBtn,
          { borderColor: c.border.default, backgroundColor: c.surface.white },
          isDisabled && s.disabled,
          pressed && s.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[s.outlineBtnText, { color: c.text.primary }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        s.btn,
        isDisabled && s.disabled,
        pressed && s.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <LinearGradient
        colors={isDark ? ['#6D4FC4', '#8B5CF6'] : ['#1D1228', '#2D1F3D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={s.primaryBtnText}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    minHeight: 54,
    marginBottom: spacing.md,
    shadowColor: '#1D1228',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  primaryBtnText: {
    color: '#fff',
    ...typography.button,
  },
  outlineBtn: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  outlineBtnText: {
    ...typography.button,
  },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
});
