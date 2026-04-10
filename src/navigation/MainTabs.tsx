import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings, LogOut, User, ChevronRight } from 'lucide-react-native';
import type { MainTabParams } from './types';
import { useColors } from '@/hooks/useColors';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { spacing, radius, shadows, typography } from '@/constants/theme';

function HomeScreen() {
  const c = useColors();
  const user = useAuthStore((st) => st.user);

  return (
    <View style={[s.center, { backgroundColor: c.neutral[50] }]}>
      <View style={[s.avatarCircle, { backgroundColor: c.brand.deep }]}>
        <Text style={s.avatarText}>
          {(user?.first_name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
        </Text>
      </View>
      <Text style={[s.title, { color: c.text.primary }]}>
        {user?.first_name ? `Hi, ${user.first_name}` : 'Welcome'}
      </Text>
      <Text style={[s.subtitle, { color: c.text.secondary }]}>
        Replace this with your app's home screen
      </Text>
    </View>
  );
}

function SettingsScreen() {
  const c = useColors();
  const user = useAuthStore((st) => st.user);
  const { mutate: logoutMutate, isPending } = useLogout();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logoutMutate() },
    ]);
  };

  return (
    <View style={[s.settingsContainer, { backgroundColor: c.neutral[50] }]}>
      <View style={[s.profileCard, { backgroundColor: c.surface.white }, shadows.card]}>
        <View style={[s.profileAvatar, { backgroundColor: c.brand.deep }]}>
          <User size={24} color="#fff" />
        </View>
        <View style={s.profileInfo}>
          <Text style={[s.profileName, { color: c.text.primary }]}>
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.email ?? 'User'}
          </Text>
          <Text style={[s.profileEmail, { color: c.text.secondary }]}>
            {user?.email ?? ''}
          </Text>
        </View>
        <ChevronRight size={20} color={c.text.placeholder} />
      </View>

      <View style={s.settingsSection}>
        <Pressable
          style={[s.logoutBtn, { borderColor: c.status.error }]}
          onPress={handleLogout}
          disabled={isPending}
          accessibilityRole="button"
        >
          <LogOut size={20} color={c.status.error} />
          <Text style={[s.logoutText, { color: c.status.error }]}>
            {isPending ? 'Signing out…' : 'Sign Out'}
          </Text>
        </Pressable>
      </View>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  title: { ...typography.title, fontSize: 24, marginBottom: spacing.sm },
  subtitle: { ...typography.subtitle, textAlign: 'center' },
  settingsContainer: { flex: 1, padding: spacing.md },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileInfo: { flex: 1 },
  profileName: { ...typography.button, fontSize: 16, marginBottom: 2 },
  profileEmail: { ...typography.small },
  settingsSection: { marginTop: 'auto', paddingBottom: spacing.xl },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  logoutText: { ...typography.button },
});
