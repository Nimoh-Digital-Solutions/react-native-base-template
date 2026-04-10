import type { User } from '@shared/types/user';

export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return '';

  const full = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
  if (full) return full;

  return user.username ?? user.email ?? '';
}

export function getUserFirstName(user: User | null | undefined): string {
  const name = getUserDisplayName(user);
  return name.split(/\s+/)[0] || '';
}
