import { useEffect, useSyncExternalStore } from 'react';
import { isServerDegraded, subscribeCircuit } from '@/services/http';

let snapshot = isServerDegraded();

function subscribe(cb: () => void) {
  return subscribeCircuit((degraded) => {
    snapshot = degraded;
    cb();
  });
}

function getSnapshot() {
  return snapshot;
}

/**
 * Returns `true` when the HTTP circuit breaker has tripped (3+ consecutive
 * 5xx responses). Auto-recovers after 30 s cooldown or when a 2xx arrives.
 */
export function useIsServerDegraded(): boolean {
  const degraded = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    snapshot = isServerDegraded();
  }, []);

  return degraded;
}
