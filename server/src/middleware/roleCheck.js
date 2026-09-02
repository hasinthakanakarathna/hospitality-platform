/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if req.user.role matches one of the allowed roles.
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const userRole = req.user.role || 'guest';

    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        error: `Forbidden: role '${userRole}' does not have required permissions`,
      });
    }

    next();
  };
}
