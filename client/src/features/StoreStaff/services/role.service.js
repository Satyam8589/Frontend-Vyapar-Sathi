import { apiGet, apiPost, apiPut, apiDelete } from '@/servies/api';

/**
 * Fetch all roles for a store (system + custom)
 */
export const fetchRoles = async (storeId) => {
  const response = await apiGet(`/store/${storeId}/roles`);
  return response;
};

/**
 * Create a custom role
 */
export const createRole = async (storeId, { name, permissions }) => {
  const response = await apiPost(`/store/${storeId}/roles`, { name, permissions });
  return response;
};

/**
 * Update a custom role's name or permissions
 */
export const updateRole = async (storeId, roleId, data) => {
  const response = await apiPut(`/store/${storeId}/roles/${roleId}`, data);
  return response;
};

/**
 * Delete a custom role
 */
export const deleteRole = async (storeId, roleId) => {
  const response = await apiDelete(`/store/${storeId}/roles/${roleId}`);
  return response;
};
