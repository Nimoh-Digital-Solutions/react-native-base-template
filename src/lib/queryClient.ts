import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { syncQueryStorage, asyncQueryStorage, usesMmkv } from './storage';

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 401 || status === 403 || status === 429) return false;
  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 2 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Production (EAS builds): MMKV sync persister — faster, no async overhead.
// Expo Go / web: AsyncStorage fallback.
export const queryPersister = usesMmkv
  ? createSyncStoragePersister({ storage: syncQueryStorage!, key: 'app-rq-cache' })
  : createAsyncStoragePersister({ storage: asyncQueryStorage, key: 'app-rq-cache' });

// Bump when query data shape changes (e.g. useQuery → useInfiniteQuery migration).
// Must be passed via persistOptions on PersistQueryClientProvider, NOT to the persister
// constructor — createSyncStoragePersister/createAsyncStoragePersister ignore the buster param.
export const CACHE_BUSTER = 'v1';
