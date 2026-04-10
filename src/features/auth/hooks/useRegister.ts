import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { RegisterBaseInput } from '@shared/schemas/auth.schema';

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterBaseInput) => {
      const { password_confirm, ...payload } = input;
      return authApi.register(payload);
    },
  });
}
