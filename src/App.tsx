import React from 'react';
import { registerRootComponent } from 'expo';
import { View, ActivityIndicator, StyleSheet, Text, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient, queryPersister, CACHE_BUSTER } from '@/lib/queryClient';
import { initSentry, reactNavigationIntegration } from '@/lib/sentry';
import { initCertPinning } from '@/lib/certPinning';
import { initAnalytics } from '@/lib/analytics';
import '@/lib/i18n';
import { RootNavigator } from '@/navigation/RootNavigator';
import { navigationRef } from '@/navigation/navigationRef';
import { linking } from '@/navigation/linking';
import { ToastRoot } from '@/components/Toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WebSocketGate } from '@/services/WebSocketGate';
import { BiometricGate } from '@/services/BiometricGate';
import { ThemeGate } from '@/services/ThemeGate';
import { useThemeStore } from '@/stores/themeStore';

if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.maxFontSizeMultiplier = 1.5;
if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.maxFontSizeMultiplier = 1.5;

initSentry();
initCertPinning();
initAnalytics();

function LoadingFallback() {
  return (
    <View style={styles.fallback}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

function PushSetupGate() {
  // Push notification setup — integrate expo-notifications registration here
  return null;
}

function OfflineMutationGate() {
  useNetworkStatus();
  return null;
}

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1D1228',
    background: '#F7F7FA',
    card: '#ffffff',
    text: '#1D1228',
    border: '#e0e0e0',
    notification: '#F97316',
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E8DFFF',
    background: '#0F0F1A',
    card: '#1A1A2E',
    text: '#F1F1F6',
    border: '#2A2A3E',
    notification: '#FB923C',
  },
};

function App() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: queryPersister, maxAge: 24 * 60 * 60 * 1000, buster: CACHE_BUSTER }}
        >
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            fallback={<LoadingFallback />}
            theme={isDark ? AppDarkTheme : AppLightTheme}
            onReady={() => reactNavigationIntegration.registerNavigationContainer(navigationRef)}
          >
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <ThemeGate />
            <BiometricGate>
              <PushSetupGate />
              <OfflineMutationGate />
              <WebSocketGate />
              <RootNavigator />
              <ToastRoot />
            </BiometricGate>
          </NavigationContainer>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    backgroundColor: '#1D1228',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
