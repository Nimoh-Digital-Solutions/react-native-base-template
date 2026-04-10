import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { wsManager } from './websocket';

export function WebSocketGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      wsManager.connect();
    } else {
      wsManager.disconnect();
    }

    return () => {
      wsManager.disconnect();
    };
  }, [isAuthenticated]);

  return null;
}
