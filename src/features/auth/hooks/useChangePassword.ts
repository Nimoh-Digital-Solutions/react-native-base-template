import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { ChangePasswordInput } from '@shared/schemas/auth.schema';

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => {
      const { confirm_new_password, ...payload } = input;
      return authApi.changePassword(payload);
    },
  });
}
