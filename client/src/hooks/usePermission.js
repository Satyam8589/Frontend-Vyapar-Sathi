'use client';

import { useCallback } from 'react';

/**
 * usePermission — Global hook to check if the current user has a specific permission.
 *
 * Usage:
 *   const canDelete = usePermission('inventory:delete', userPermissions);
 *   const canViewProfit = usePermission('reports:view_profit', userPermissions);
 *
 * If the user is the store owner, pass isOwner=true to bypass all checks.
 *
 * @param {string[]} userPermissions - The current user's permission array from their role
 * @param {boolean} isOwner - If true, all permissions are granted
 * @returns {{ hasPermission: Function, hasAny: Function, hasAll: Function }}
 */
export const usePermission = (userPermissions = [], isOwner = false) => {

  /** Check if user has a single permission */
  const hasPermission = useCallback((permissionKey) => {
    if (isOwner) return true;
    if (!permissionKey) return false;
    return userPermissions.includes(permissionKey);
  }, [userPermissions, isOwner]);

  /** Check if user has AT LEAST ONE of the given permissions */
  const hasAny = useCallback((permissionKeys = []) => {
    if (isOwner) return true;
    return permissionKeys.some((key) => userPermissions.includes(key));
  }, [userPermissions, isOwner]);

  /** Check if user has ALL of the given permissions */
  const hasAll = useCallback((permissionKeys = []) => {
    if (isOwner) return true;
    return permissionKeys.every((key) => userPermissions.includes(key));
  }, [userPermissions, isOwner]);

  return { hasPermission, hasAny, hasAll };
};

export default usePermission;
