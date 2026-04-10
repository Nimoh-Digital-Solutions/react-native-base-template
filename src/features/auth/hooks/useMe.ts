import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authKeys } from './authKeys';

export function useMe(options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000, // 5 min
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  });
}
