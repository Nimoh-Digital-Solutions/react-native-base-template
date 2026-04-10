import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_DIMENSION = 512;
const JPEG_QUALITY = 0.8;

/**
 * Compress and resize an image URI for avatar uploads.
 * Returns a new file URI with the optimised image.
 */
export async function compressAvatar(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: MAX_DIMENSION, height: MAX_DIMENSION } }],
    { compress: JPEG_QUALITY, format: SaveFormat.JPEG },
  );
  return result.uri;
}
