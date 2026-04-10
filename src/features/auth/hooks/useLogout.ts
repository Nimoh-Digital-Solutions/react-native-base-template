import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { tokenStorage } from '@/lib/storage';
import { resetAnalytics } from '@/lib/analytics';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSettled: () => {
      resetAnalytics();
      logout();
    },
  });
}
