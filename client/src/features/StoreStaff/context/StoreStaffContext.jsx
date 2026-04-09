'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as employeeService from '../services/employee.service';
import * as roleService from '../services/role.service';

const StoreStaffContext = createContext(undefined);

export const StoreStaffProvider = ({ storeId, children }) => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Employees ─────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await employeeService.fetchEmployees(storeId);
      setEmployees(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const inviteEmployee = useCallback(async ({ email, roleId }) => {
    const res = await employeeService.inviteEmployee(storeId, { email, roleId });
    await fetchEmployees();
    return res;
  }, [storeId, fetchEmployees]);

  const updateEmployee = useCallback(async (employeeId, data) => {
    const res = await employeeService.updateEmployee(storeId, employeeId, data);
    await fetchEmployees();
    return res;
  }, [storeId, fetchEmployees]);

  const removeEmployee = useCallback(async (employeeId) => {
    const res = await employeeService.removeEmployee(storeId, employeeId);
    await fetchEmployees();
    return res;
  }, [storeId, fetchEmployees]);

  // ─── Roles ─────────────────────────────────────────────────
  const fetchRoles = useCallback(async () => {
    try {
      const res = await roleService.fetchRoles(storeId);
      setRoles(res?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load roles');
    }
  }, [storeId]);

  const createRole = useCallback(async ({ name, permissions }) => {
    const res = await roleService.createRole(storeId, { name, permissions });
    await fetchRoles();
    return res;
  }, [storeId, fetchRoles]);

  const updateRole = useCallback(async (roleId, data) => {
    const res = await roleService.updateRole(storeId, roleId, data);
    await fetchRoles();
    return res;
  }, [storeId, fetchRoles]);

  const deleteRole = useCallback(async (roleId) => {
    const res = await roleService.deleteRole(storeId, roleId);
    await fetchRoles();
    return res;
  }, [storeId, fetchRoles]);

  const value = {
    // State
    employees,
    roles,
    loading,
    error,
    // Employee actions
    fetchEmployees,
    inviteEmployee,
    updateEmployee,
    removeEmployee,
    // Role actions
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };

  return (
    <StoreStaffContext.Provider value={value}>
      {children}
    </StoreStaffContext.Provider>
  );
};

export const useStoreStaffContext = () => {
  const context = useContext(StoreStaffContext);
  if (!context) {
    throw new Error('useStoreStaffContext must be used within StoreStaffProvider');
  }
  return context;
};

export default StoreStaffContext;
