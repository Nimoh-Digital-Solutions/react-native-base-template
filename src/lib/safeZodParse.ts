import type { ZodSchema } from 'zod';
import { captureException, addBreadcrumb } from '@/lib/sentry';

/**
 * Parse data through a Zod schema. On failure, log the error to Sentry
 * but return the raw data as-is so the UI doesn't break from minor
 * schema drift (e.g. a DecimalField coming as string instead of number).
 */
export function zodParse<T>(schema: ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  addBreadcrumb('zod', `Validation failed: ${label}`, {
    payload: JSON.stringify(data)?.slice(0, 2000),
  });
  captureException(result.error, { zodLabel: label });
  return data as T;
}
