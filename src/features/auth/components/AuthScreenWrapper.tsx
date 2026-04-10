import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsDark } from '@/hooks/useColors';
import { OfflineBanner } from '@/components/OfflineBanner';
import { spacing } from '@/constants/theme';

type AuthScreenWrapperProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  centered?: boolean;
};

export function AuthScreenWrapper({
  children,
  scrollable = true,
  centered = false,
}: AuthScreenWrapperProps) {
  const isDark = useIsDark();

  const gradientColors: [string, string, string] = isDark
    ? ['#0F0F1A', '#141425', '#0F0F1A']
    : ['#F7F7FA', '#EDE9FE', '#F7F7FA'];

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[s.scroll, centered && s.centered]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <LinearGradient colors={gradientColors} locations={[0, 0.4, 1]} style={s.flex}>
      <SafeAreaView style={s.flex}>
        <OfflineBanner />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.flex}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
