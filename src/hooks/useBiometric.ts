import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useBiometric() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    async function check() {
      const LocalAuthentication = await import('expo-local-authentication');
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    }
    check();
  }, []);

  const authenticate = async (promptMessage?: string): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    try {
      const LocalAuthentication = await import('expo-local-authentication');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  };

  return { isBiometricAvailable, authenticate };
}
