/**
 * Utility function to get the correct image path for GitHub Pages deployment
 * @param path - The image path starting with /
 * @returns The image path with the correct base path prefix in production
 */
export function getImagePath(path: string): string {
  // In production on GitHub Pages, images are served from /GCMS/
  // Plain <img> tags don't automatically get the basePath prefix like Next.js <Image> does
  // Firebase Hosting serves from root, so no prefix needed
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_DEPLOY_TARGET !== 'firebase') {
    return `/GCMS${path}`;
  }
  return path;
}
