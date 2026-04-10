import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';

interface Props {
  uri?: string;
  name: string;
  size?: number;
  borderColor?: string;
  /** Override the default circular border-radius (size / 2). */
  borderRadius?: number;
}

export function Avatar({ uri, name, size = 48, borderColor, borderRadius: borderRadiusOverride }: Props) {
  const c = useColors();
  const [loadFailed, setLoadFailed] = useState(false);
  const prevUri = useRef(uri);

  useEffect(() => {
    if (uri !== prevUri.current) {
      setLoadFailed(false);
      prevUri.current = uri;
    }
  }, [uri]);

  const onError = useCallback(() => setLoadFailed(true), []);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const borderRadius = borderRadiusOverride ?? size / 2;
  const resolvedBorderColor = borderColor ?? c.border.focus;

  if (uri && !loadFailed) {
    return (
      <Image
        source={{ uri }}
        cachePolicy="memory-disk"
        contentFit="cover"
        transition={200}
        recyclingKey={uri}
        style={[
          s.image,
          {
            width: size,
            height: size,
            borderRadius,
            borderColor: resolvedBorderColor,
            backgroundColor: c.border.default,
          },
        ]}
        accessibilityLabel={name}
        onError={onError}
      />
    );
  }

  return (
    <View style={[s.fallback, { width: size, height: size, borderRadius, borderColor: resolvedBorderColor, backgroundColor: c.brand.deep }]} accessibilityLabel={name}>
      <Text style={[s.initials, { fontSize: size * 0.38, color: c.text.inverse }]}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  image: { borderWidth: 2 },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: { fontWeight: '700' },
});
