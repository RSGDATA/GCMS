/**
 * Utility function to get the correct navigation path for deployment
 * This ensures consistent navigation across different deployment environments
 * @param path - The navigation path starting with /
 * @returns The navigation path (no prefix needed for modern GitHub Pages with custom domain)
 */
export function getNavigationPath(path: string): string {
  return path;
}
