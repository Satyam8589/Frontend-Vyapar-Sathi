import { apiGet, apiPost, apiPut, apiDelete } from '@/servies/api';

/**
 * Fetch all employees for a store
 */
export const fetchEmployees = async (storeId) => {
  const response = await apiGet(`/store/${storeId}/employees`);
  return response;
};

/**
 * Invite an employee by email + role
 */
export const inviteEmployee = async (storeId, { email, roleId }) => {
  const response = await apiPost(`/store/${storeId}/employees`, { email, roleId });
  return response;
};

/**
 * Update employee role or status
 */
export const updateEmployee = async (storeId, employeeId, data) => {
  const response = await apiPut(`/store/${storeId}/employees/${employeeId}`, data);
  return response;
};

/**
 * Remove an employee from the store
 */
export const removeEmployee = async (storeId, employeeId) => {
  const response = await apiDelete(`/store/${storeId}/employees/${employeeId}`);
  return response;
};
