import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, type ViewStyle, type DimensionValue } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useColors, useIsDark } from '@/hooks/useColors';
import { useReduceMotion } from '@/hooks/useReduceMotion';

interface Props {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width = '100%', height = 16, borderRadius: br = radius.md, style }: Props) {
  const c = useColors();
  const isDark = useIsDark();
  const reduceMotion = useReduceMotion();
  const opacity = useRef(new Animated.Value(reduceMotion ? 0.5 : 0.3)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity, reduceMotion]);

  const shimmerBg = isDark ? c.neutral[200] : c.border.default;

  return (
    <Animated.View
      style={[
        s.base,
        { width, height, borderRadius: br, opacity, backgroundColor: shimmerBg },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const c = useColors();
  const isDark = useIsDark();
  return (
    <View style={[s.card, { backgroundColor: c.surface.white, borderWidth: isDark ? 1 : 0, borderColor: c.neutral[200] + '60' }]}>
      <SkeletonLoader height={spacing.md + spacing.xs} width="60%" />
      <SkeletonLoader height={radius.xl} width="90%" style={{ marginTop: spacing.sm }} />
      <SkeletonLoader height={radius.xl} width="40%" style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const s = StyleSheet.create({
  base: { backgroundColor: colors.border.default },
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + spacing.xs,
  },
});
