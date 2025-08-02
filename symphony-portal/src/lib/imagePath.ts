/**
 * Utility function to get the correct image path for custom domain deployment
 * @param path - The image path starting with /
 * @returns The image path (no base path needed for custom domain)
 */
export function getImagePath(path: string): string {
  // For custom domain deployment, no base path is needed
  return path;
}
