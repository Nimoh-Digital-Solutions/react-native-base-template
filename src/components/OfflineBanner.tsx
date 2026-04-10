import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useIsServerDegraded } from '@/hooks/useIsServerDegraded';
import { useMotionDuration } from '@/hooks/useReduceMotion';
import { colors, typography, spacing } from '@/constants/theme';
import { useColors } from '@/hooks/useColors';

export function OfflineBanner() {
  const { t } = useTranslation();
  const c = useColors();
  const { isOnline } = useNetworkStatus();
  const isDegraded = useIsServerDegraded();
  const duration = useMotionDuration(300);
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOffline = useRef(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    }

    if (isOnline && wasOffline.current) {
      wasOffline.current = false;
      setShowReconnected(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }).start(() => setShowReconnected(false));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, opacity, duration]);

  if (showReconnected) {
    return (
      <Animated.View style={[s.banner, s.reconnected, { opacity, backgroundColor: c.offline.reconnected }]}>
        <Text style={s.text}>{t('common.offline.backOnline')}</Text>
      </Animated.View>
    );
  }

  if (!isOnline) {
    return (
      <View
        style={[s.banner, s.offline, { backgroundColor: c.offline.banner }]}
        accessibilityRole="alert"
        accessibilityLabel={t('common.offline.banner')}
      >
        <Text style={s.text}>{t('common.offline.banner')}</Text>
      </View>
    );
  }

  if (isDegraded) {
    return (
      <View
        style={[s.banner, { backgroundColor: c.status.warning }]}
        accessibilityRole="alert"
        accessibilityLabel={t('common.offline.serverDegraded')}
      >
        <Text style={s.text}>{t('common.offline.serverDegraded')}</Text>
      </View>
    );
  }

  return null;
}

const s = StyleSheet.create({
  banner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  offline: { backgroundColor: colors.offline.banner },
  reconnected: { backgroundColor: colors.offline.reconnected },
  text: { color: '#fff', ...typography.small, fontWeight: '600' },
});
