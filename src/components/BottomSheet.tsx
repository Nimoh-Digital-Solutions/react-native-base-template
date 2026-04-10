import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Pressable,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useColors, useIsDark } from '@/hooks/useColors';
import { useMotionDuration } from '@/hooks/useReduceMotion';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Scrim opacity differs by mode so dark UI stays legible while keeping a consistent black tint. */
const BACKDROP_RGBA = { light: 'rgba(0,0,0,0.4)', dark: 'rgba(0,0,0,0.6)' } as const;

export function BottomSheet({ visible, onClose, children }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const c = useColors();
  const isDark = useIsDark();
  const duration = useMotionDuration(300);
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      translateY.setValue(windowHeight);
    }
  }, [windowHeight, visible, translateY]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: duration > 0 ? 250 : 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration > 0 ? 250 : 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity, duration, windowHeight]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={s.container}>
        <Animated.View
          style={[
            s.backdrop,
            {
              opacity,
              backgroundColor: isDark ? BACKDROP_RGBA.dark : BACKDROP_RGBA.light,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Dismiss" />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.kav}
        >
          <Animated.View
            style={[
              s.sheet,
              { transform: [{ translateY }], backgroundColor: c.surface.white, maxHeight: windowHeight * 0.85 },
            ]}
          >
            <View style={[s.handle, { backgroundColor: c.border.default }]} />
            <ScrollView
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  kav: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.default,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});
