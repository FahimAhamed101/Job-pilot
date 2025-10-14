// Define available roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  VENDOR: "vendor",
  MODERATOR: "moderator",
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.MODERATOR]: 2,
  [ROLES.VENDOR]: 1,
  [ROLES.USER]: 0,
};

// Check if user has specific role
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

// Check if user has any of the specified roles
export const hasAnyRole = (userRole, roles = []) => {
  return roles.includes(userRole);
};

// Check if user has at least the required role level
export const hasMinimumRole = (userRole, minimumRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
};

// Get role-based redirect path
export const getRoleBasedRedirect = (role) => {
  const redirects = {
    [ROLES.ADMIN]: "/admin/dashboard",
    [ROLES.MODERATOR]: "/moderator/dashboard",
    [ROLES.VENDOR]: "/vendor/dashboard",
    [ROLES.USER]: "/user/dashboard",
  };
  return redirects[role] || "/dashboard";
};

// Check if user can access a specific route
export const canAccessRoute = (userRole, routeRoles = []) => {
  if (routeRoles.length === 0) return true;
  return hasAnyRole(userRole, routeRoles);
};

// Get user permissions based on role
export const getPermissionsByRole = (role) => {
  const permissions = {
    [ROLES.ADMIN]: [
      "read:all",
      "write:all",
      "delete:all",
      "manage:users",
      "manage:products",
      "manage:categories",
      "view:analytics",
      "manage:subscriptions",
    ],
    [ROLES.MODERATOR]: [
      "read:all",
      "write:products",
      "manage:products",
      "view:analytics",
    ],
    [ROLES.VENDOR]: [
      "read:own",
      "write:own",
      "manage:own_products",
      "view:own_analytics",
    ],
    [ROLES.USER]: [
      "read:public",
      "write:own_profile",
      "view:own_orders",
    ],
  };
  return permissions[role] || [];
};

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  const userPermissions = getPermissionsByRole(userRole);
  return userPermissions.includes(permission);
};