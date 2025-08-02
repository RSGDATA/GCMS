/**
 * Utility function to get the correct image path for GitHub Pages deployment
 * @param path - The image path starting with /
 * @returns The image path with correct base path for GitHub Pages
 */
export function getImagePath(path: string): string {
  // In production (GitHub Pages), add the /GCMS base path
  // In development, use the path as-is
  const basePath = process.env.NODE_ENV === 'production' ? '/GCMS' : '';
  return `${basePath}${path}`;
}
