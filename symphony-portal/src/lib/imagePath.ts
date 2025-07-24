/**
 * Utility function to get the correct image path for GitHub Pages deployment
 * @param path - The image path starting with /
 * @returns The correct path with basePath prefix in production
 */
export function getImagePath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/GCMS' : '';
  return `${basePath}${path}`;
}
