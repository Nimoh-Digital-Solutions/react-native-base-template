/**
 * Extract the cursor value from a DRF CursorPagination `next` or `previous` URL.
 * Returns undefined if there is no next page.
 */
export function extractCursor(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url, 'https://placeholder.local');
    return parsed.searchParams.get('cursor') ?? undefined;
  } catch {
    return undefined;
  }
}
