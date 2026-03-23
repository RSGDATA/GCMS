/**
 * Utility function to get the correct navigation path for deployment
 * This ensures consistent navigation across different deployment environments
 * @param path - The navigation path starting with /
 * @returns The navigation path (no prefix needed for modern GitHub Pages with custom domain)
 */
export function getNavigationPath(path: string): string {
  return path;
}

/**
 * Central configuration for footer Quick Links.
 * Add, remove, or reorder links here — changes will appear everywhere automatically.
 */
export const QUICK_LINKS = [
  { href: '/concerts', label: 'Concerts' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/about', label: 'About' },
  { href: '/musicians/login', label: 'Musicians Login' },
];

/**
 * Central configuration for footer Programs links.
 * Add, remove, or reorder links here — changes will appear everywhere automatically.
 */
export const PROGRAMS_LINKS = [
  { href: '/students/signup', label: 'Student Outreach Program' },
];
