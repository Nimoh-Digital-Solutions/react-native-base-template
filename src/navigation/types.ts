import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

export type AuthStackParams = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerificationPending: { email: string };
  Verified: { status?: string };
};

export type MainTabParams = {
  Home: undefined;
  Settings: undefined;
};

export type RootStackParams = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParams>;
  MainTabs: NavigatorScreenParams<MainTabParams>;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParams>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParams>,
  RootStackNavigationProp
>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParams {}
  }
}
