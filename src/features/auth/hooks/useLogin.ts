import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { captureException } from '@/lib/sentry';
import type { LoginInput } from '@shared/schemas/auth.schema';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      try {
        const fullUser = await authApi.getMe();
        setUser(fullUser);
      } catch (err) {
        captureException(err, { context: 'useLogin.getMe' });
      }
    },
  });
}
