import { useCallback, useRef, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { captureException } from '@/lib/sentry';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

const hasNativeModule = !!NativeModules.RNGoogleSignin;

export function useGoogleSignIn() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const [isPending, setIsPending] = useState(false);
  const configured = useRef(false);

  const signIn = useCallback(async () => {
    if (!hasNativeModule) {
      return { success: false as const, error: 'unavailable' as const };
    }

    setIsPending(true);
    try {
      // Optional native module — keep require so Metro/Expo Go without the signer does not fail at import time.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleSignin, isSuccessResponse } = require('@react-native-google-signin/google-signin');

      if (!configured.current) {
        if (!WEB_CLIENT_ID) {
          return { success: false as const, error: 'google_not_configured' as const };
        }
        // iOS requires iosClientId or GoogleService-Info.plist; undefined triggers a native redbox.
        if (Platform.OS === 'ios' && !IOS_CLIENT_ID) {
          return { success: false as const, error: 'google_not_configured' as const };
        }
        GoogleSignin.configure({
          webClientId: WEB_CLIENT_ID,
          iosClientId: IOS_CLIENT_ID || undefined,
          offlineAccess: false,
        });
        configured.current = true;
      }

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        return { success: false as const, error: 'cancelled' as const };
      }

      const idToken = response.data?.idToken;
      if (!idToken) {
        return { success: false as const, error: 'no_token' as const };
      }

      const data = await authApi.googleSignIn(idToken);
      setAuth(data.user, data.access_token, data.refresh_token);

      try {
        const fullUser = await authApi.getMe();
        setUser(fullUser);
      } catch (err) {
        captureException(err, { context: 'useGoogleSignIn.getMe' });
      }

      return { success: true as const };
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isErrorWithCode, statusCodes } = require('@react-native-google-signin/google-signin');
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          return { success: false as const, error: 'cancelled' as const };
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          return { success: false as const, error: 'play_services' as const };
        }
      }
      return { success: false as const, error: 'unknown' as const };
    } finally {
      setIsPending(false);
    }
  }, [setAuth, setUser]);

  return { signIn, isPending };
}
