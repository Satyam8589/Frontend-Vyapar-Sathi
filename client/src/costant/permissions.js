export const PERMISSIONS = {
  BILLING_CREATE:         "billing:create",      // Can create bills & view history
  INVENTORY_ADD:          "inventory:add",       // Can add new products
  INVENTORY_MANAGE:       "inventory:manage",    // Can edit and delete products
};

// Category grouping for the UI Role Editor
export const PERMISSION_GROUPS = [
  {
    id: 'core_actions',
    label: 'Store Access Permissions',
    permissions: [
      { key: PERMISSIONS.BILLING_CREATE, label: 'Billing Access (Scan & Create Bills)' },
      { key: PERMISSIONS.INVENTORY_ADD, label: 'Add Product Access (New Stock)' },
      { key: PERMISSIONS.INVENTORY_MANAGE, label: 'Manage Access (Edit & Delete Stock)' },
    ]
  }
];
