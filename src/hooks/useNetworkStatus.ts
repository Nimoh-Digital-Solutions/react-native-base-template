import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from '@/lib/queryClient';

function invalidateStaleQueries() {
  queryClient.invalidateQueries();
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => {
        setIsOnline(true);
        invalidateStaleQueries();
      };
      const handleOffline = () => setIsOnline(false);

      const win = globalThis.window as Window | undefined;
      if (!win?.addEventListener || typeof win.removeEventListener !== 'function') return;

      win.addEventListener('online', handleOnline);
      win.addEventListener('offline', handleOffline);
      setIsOnline(globalThis.navigator?.onLine ?? true);

      return () => {
        win.removeEventListener('online', handleOnline);
        win.removeEventListener('offline', handleOffline);
      };
    }

    let prevOnline = true;
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const nowOnline = state.isConnected ?? false;
      if (!prevOnline && nowOnline) {
        invalidateStaleQueries();
      }
      prevOnline = nowOnline;
      setIsOnline(nowOnline);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline };
}
