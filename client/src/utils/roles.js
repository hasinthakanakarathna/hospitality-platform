/**
 * Role constants and permission helpers.
 * Centralized here so we don't have magic strings scattered across the codebase.
 */

export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
};

// Which sidebar items each role can see
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'dashboard', 'rooms', 'bookings', 'guests',
    'housekeeping', 'billing', 'staff', 'reports',
  ],
  [ROLES.RECEPTIONIST]: [
    'dashboard', 'rooms', 'bookings', 'guests',
    'housekeeping', 'billing',
  ],
  [ROLES.HOUSEKEEPING]: [
    'dashboard', 'rooms', 'housekeeping',
  ],
};

/**
 * Check if a role has access to a specific page/feature.
 * @param {string} role - User's role
 * @param {string} page - Page identifier (e.g., 'rooms', 'staff')
 * @returns {boolean}
 */
export function hasAccess(role, page) {
  return ROLE_PERMISSIONS[role]?.includes(page) ?? false;
}
