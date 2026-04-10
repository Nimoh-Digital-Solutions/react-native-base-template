import { addBreadcrumb } from '@/lib/sentry';

let enabled = false;

export function initAnalytics() {
  if (__DEV__) return;
  enabled = true;
  addBreadcrumb('analytics', 'Analytics initialised (stub — integrate your provider)');
}

export function identifyUser(_userId: string, _traits?: Record<string, unknown>) {
  if (!enabled) return;
}

export function resetAnalytics() {
  // Reset analytics state on logout
}

export function track(_event: string, _properties?: Record<string, unknown>) {
  if (!enabled) return;
}
