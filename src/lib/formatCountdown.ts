import type { TFunction } from 'i18next';

const MS_MIN = 60_000;
const MS_HOUR = 3_600_000;
const MS_DAY = 86_400_000;
const MS_WEEK = 604_800_000;

/**
 * Human-readable countdown with smart granularity and proper plurals:
 *   > 7 days  → "2 weeks"
 *   3–7 days  → "3 days"
 *   1–2 days  → "1 day 4 hours" or "2 days 16 hours"
 *   6h–24h    → "18 hours"
 *   < 6 hours → "4h 46m"
 *   < 1 hour  → "46 min"
 *   ≤ 0       → "Starting now!"
 */
export function formatCountdown(targetDate: Date, t: TFunction): string {
  const diffMs = targetDate.getTime() - Date.now();
  if (diffMs <= 0) return t('countdown.now');

  const totalMin = Math.floor(diffMs / MS_MIN);
  const totalHours = Math.floor(diffMs / MS_HOUR);
  const totalDays = Math.floor(diffMs / MS_DAY);
  const totalWeeks = Math.floor(diffMs / MS_WEEK);

  if (totalMin < 1) return t('countdown.now');

  if (totalMin < 60) {
    return t('countdown.minutes', { minutes: totalMin });
  }

  if (totalHours < 6) {
    const mins = totalMin - totalHours * 60;
    return mins > 0
      ? t('countdown.hoursMinutes', { hours: totalHours, minutes: mins })
      : t('countdown.hour', { count: totalHours });
  }

  if (totalHours < 24) {
    return t('countdown.hour', { count: totalHours });
  }

  if (totalDays <= 2) {
    const remainingHours = Math.floor((diffMs % MS_DAY) / MS_HOUR);
    const dayPart = t('countdown.day', { count: totalDays });
    if (remainingHours > 0) {
      const hourPart = t('countdown.hour', { count: remainingHours });
      return t('countdown.composite', { first: dayPart, second: hourPart });
    }
    return dayPart;
  }

  if (totalDays <= 7) {
    return t('countdown.day', { count: totalDays });
  }

  return t('countdown.week', { count: totalWeeks });
}

/**
 * Full "Starts in …" label wrapping `formatCountdown`.
 */
export function formatStartsIn(targetDate: Date, t: TFunction): string {
  const diffMs = targetDate.getTime() - Date.now();
  if (diffMs <= 0) return t('countdown.now');
  return t('countdown.startsIn', { time: formatCountdown(targetDate, t) });
}
