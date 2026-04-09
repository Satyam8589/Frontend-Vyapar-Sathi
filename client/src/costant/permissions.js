/**
 * MASTER PERMISSION LIST — Vyapar-Sathi Frontend
 * 
 * This must be kept in sync with the backend.
 * Defines all granular access keys.
 */

export const PERMISSIONS = {
  // Billing & Checkout
  BILLING_VIEW:           "billing:view",
  BILLING_CREATE:         "billing:create",
  BILLING_APPLY_DISCOUNT: "billing:apply_discount",
  BILLING_CANCEL:         "billing:cancel_bill",
  BILLING_VIEW_HISTORY:   "billing:view_history",
  BILLING_PRINT:          "billing:print_bill",
  BILLING_ACCEPT_UPI:     "billing:accept_upi",
  BILLING_ACCEPT_CASH:    "billing:accept_cash",

  // Inventory Management
  INVENTORY_VIEW:         "inventory:view",
  INVENTORY_ADD:          "inventory:add",
  INVENTORY_EDIT:         "inventory:edit",
  INVENTORY_DELETE:       "inventory:delete",
  INVENTORY_VIEW_COST:    "inventory:view_cost_price",
  INVENTORY_MANAGE_STOCK: "inventory:manage_stock",
  INVENTORY_MANAGE_EXPIRY:"inventory:manage_expiry",
  INVENTORY_IMPORT_EXPORT:"inventory:import_export",

  // Reports & Analytics
  REPORTS_VIEW_SALES:     "reports:view_sales",
  REPORTS_VIEW_STOCK:     "reports:view_stock",
  REPORTS_VIEW_PROFIT:    "reports:view_profit",
  REPORTS_EXPORT:         "reports:export",

  // Store Settings
  STORE_VIEW_SETTINGS:    "store:view_settings",
  STORE_EDIT_SETTINGS:    "store:edit_settings",
  STORE_MANAGE_UPI:       "store:manage_upi",
  STORE_MANAGE_EMPLOYEES: "store:manage_employees",
  STORE_MANAGE_ROLES:     "store:manage_roles",

  // Employee Management
  EMPLOYEES_VIEW:         "employees:view",
  EMPLOYEES_INVITE:       "employees:invite",
  EMPLOYEES_REMOVE:       "employees:remove",
  EMPLOYEES_EDIT_ROLE:    "employees:edit_role",
};

// Category grouping for the UI Role Editor
export const PERMISSION_GROUPS = [
  {
    id: 'billing',
    label: 'Billing & Checkout',
    permissions: [
      { key: PERMISSIONS.BILLING_VIEW, label: 'View Billing POS' },
      { key: PERMISSIONS.BILLING_CREATE, label: 'Create Bills' },
      { key: PERMISSIONS.BILLING_APPLY_DISCOUNT, label: 'Apply Discounts' },
      { key: PERMISSIONS.BILLING_CANCEL, label: 'Cancel Bills' },
      { key: PERMISSIONS.BILLING_VIEW_HISTORY, label: 'View Bill History' },
      { key: PERMISSIONS.BILLING_PRINT, label: 'Print Receipts' },
      { key: PERMISSIONS.BILLING_ACCEPT_UPI, label: 'Accept UPI Payments' },
      { key: PERMISSIONS.BILLING_ACCEPT_CASH, label: 'Accept Cash Payments' },
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    permissions: [
      { key: PERMISSIONS.INVENTORY_VIEW, label: 'View Inventory' },
      { key: PERMISSIONS.INVENTORY_ADD, label: 'Add Products' },
      { key: PERMISSIONS.INVENTORY_EDIT, label: 'Edit Products' },
      { key: PERMISSIONS.INVENTORY_DELETE, label: 'Delete Products' },
      { key: PERMISSIONS.INVENTORY_VIEW_COST, label: 'See Purchase Price' },
      { key: PERMISSIONS.INVENTORY_MANAGE_STOCK, label: 'Update Stock Levels' },
      { key: PERMISSIONS.INVENTORY_MANAGE_EXPIRY, label: 'Manage Expiry Dates' },
      { key: PERMISSIONS.INVENTORY_IMPORT_EXPORT, label: 'Bulk Import/Export' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    permissions: [
      { key: PERMISSIONS.REPORTS_VIEW_SALES, label: 'Sales Reports' },
      { key: PERMISSIONS.REPORTS_VIEW_STOCK, label: 'Stock Reports' },
      { key: PERMISSIONS.REPORTS_VIEW_PROFIT, label: 'Profit Reporting' },
      { key: PERMISSIONS.REPORTS_EXPORT, label: 'Export Data' },
    ]
  },
  {
    id: 'store',
    label: 'Store Settings',
    permissions: [
      { key: PERMISSIONS.STORE_VIEW_SETTINGS, label: 'View Shop Info' },
      { key: PERMISSIONS.STORE_EDIT_SETTINGS, label: 'Edit Shop Info' },
      { key: PERMISSIONS.STORE_MANAGE_UPI, label: 'Setup Payments/QR' },
      { key: PERMISSIONS.STORE_MANAGE_ROLES, label: 'Manage Permissions' },
      { key: PERMISSIONS.STORE_MANAGE_EMPLOYEES, label: 'Full Access (Staff Mgmt)' },
    ]
  }
];
