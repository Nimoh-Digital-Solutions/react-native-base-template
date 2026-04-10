import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParams } from './types';

export const linking: LinkingOptions<RootStackParams> = {
  prefixes: ['{{PROJECT_SLUG}}://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          Verified: {
            path: 'auth/verified',
            parse: {
              status: (value: string) => value,
            },
          },
        },
      },
      MainTabs: {
        screens: {
          Home: 'home',
          Settings: 'settings',
        },
      },
    },
  },
};
