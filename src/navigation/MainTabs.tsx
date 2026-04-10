import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings } from 'lucide-react-native';
import type { MainTabParams } from './types';
import { useColors } from '@/hooks/useColors';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function HomeScreen() {
  const c = useColors();
  return (
    <View style={[s.center, { backgroundColor: c.neutral[50] }]}>
      <Text style={[s.title, { color: c.text.primary }]}>Home</Text>
      <Text style={[s.subtitle, { color: c.text.secondary }]}>
        Replace this with your app's home screen
      </Text>
    </View>
  );
}

function SettingsScreen() {
  const c = useColors();
  return (
    <View style={[s.center, { backgroundColor: c.neutral[50] }]}>
      <Text style={[s.title, { color: c.text.primary }]}>Settings</Text>
      <Text style={[s.subtitle, { color: c.text.secondary }]}>
        Replace this with your app's settings screen
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator<MainTabParams>();

export function MainTabs() {
  const c = useColors();

  return (
    <ErrorBoundary label="MainTabs">
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: c.brand.deep,
          tabBarInactiveTintColor: c.text.placeholder,
          headerStyle: { backgroundColor: c.neutral[50] },
          headerTintColor: c.text.primary,
          headerShadowVisible: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </ErrorBoundary>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
});
