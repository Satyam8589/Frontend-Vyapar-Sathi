'use client';

/**
 * PermissionGuard — Conditionally renders children based on permissions.
 *
 * Usage Examples:
 *
 * 1. Single permission — hides if not allowed:
 *    <PermissionGuard permission="inventory:delete" userPermissions={permissions} isOwner={isOwner}>
 *      <DeleteButton />
 *    </PermissionGuard>
 *
 * 2. With a fallback element if denied:
 *    <PermissionGuard permission="reports:view_profit" userPermissions={permissions} fallback={<p>Access Denied</p>}>
 *      <ProfitCard />
 *    </PermissionGuard>
 *
 * 3. Disabled mode — shows element but disables it:
 *    <PermissionGuard permission="billing:apply_discount" userPermissions={permissions} disableOnly>
 *      <DiscountButton />
 *    </PermissionGuard>
 */
const PermissionGuard = ({
  permission,         // single permission key string
  userPermissions = [], // array of permission strings from user's role
  isOwner = false,    // if true, always render
  fallback = null,    // what to render if denied (default: nothing)
  disableOnly = false, // if true, render but pass disabled={true} to child
  children,
}) => {
  const isAllowed = isOwner || (permission ? userPermissions.includes(permission) : true);

  if (!isAllowed) {
    if (disableOnly) {
      // Clone child with disabled prop
      return children ? (
        <span style={{ opacity: 0.4, pointerEvents: 'none', cursor: 'not-allowed' }}>
          {children}
        </span>
      ) : null;
    }
    return fallback;
  }

  return children;
};

export default PermissionGuard;
