import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/features/auth/stores/authStore';
import type { RootStackParams } from './types';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Stack = createNativeStackNavigator<RootStackParams>();

export function RootNavigator() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isHydrated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <ErrorBoundary label="RootNavigator">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
