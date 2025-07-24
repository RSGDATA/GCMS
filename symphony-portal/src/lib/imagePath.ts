/**
 * Utility function to get the correct image path for custom domain deployment
 * @param path - The image path starting with /
 * @returns The image path (no prefix needed for custom domain)
 */
export function getImagePath(path: string): string {
  return path;
}
