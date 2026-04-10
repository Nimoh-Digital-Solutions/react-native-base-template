import { Platform } from 'react-native';
import { addBreadcrumb } from '@/lib/sentry';

/**
 * SSL public key pinning for the SpeakLinka API domain.
 *
 * How to generate pin hashes for your production domain:
 *   openssl s_client -servername api.speaklinka.com -connect api.speaklinka.com:443 \
 *     | openssl x509 -pubkey -noout \
 *     | openssl pkey -pubin -outform der \
 *     | openssl dgst -sha256 -binary \
 *     | openssl enc -base64
 *
 * Always include at least one backup pin (e.g. the CA intermediate cert)
 * to avoid bricking the app if the leaf cert rotates.
 */

const API_HOST = process.env.EXPO_PUBLIC_API_HOST ?? '';
const PIN_HASHES: string[] = JSON.parse(
  process.env.EXPO_PUBLIC_SSL_PINS ?? '[]',
);

let pinningInitialised = false;

export function isCertPinningActive(): boolean {
  return __DEV__ || Platform.OS === 'web' || !API_HOST || PIN_HASHES.length === 0 || pinningInitialised;
}

export async function initCertPinning() {
  if (__DEV__) return;
  if (!API_HOST || PIN_HASHES.length === 0) return;
  if (Platform.OS === 'web') return;

  try {
    const { initializeSslPinning } = await import('react-native-ssl-public-key-pinning');
    await initializeSslPinning({
      [API_HOST]: {
        includeSubdomains: true,
        publicKeyHashes: PIN_HASHES,
      },
    });
    pinningInitialised = true;
    addBreadcrumb('security', 'SSL pinning initialised', { host: API_HOST });
  } catch (e) {
    // ADV-606: Fail closed — report as a Sentry error, not just a breadcrumb.
    // Callers should check isCertPinningActive() and degrade gracefully.
    pinningInitialised = false;
    try {
      const Sentry = await import('@sentry/react-native');
      Sentry.captureException(e, { tags: { component: 'certPinning' } });
    } catch {
      // Sentry itself unavailable — best-effort console warning.
    }
    addBreadcrumb('security', 'SSL pinning init FAILED — connections may be at risk', {
      error: String(e),
    });
  }
}
