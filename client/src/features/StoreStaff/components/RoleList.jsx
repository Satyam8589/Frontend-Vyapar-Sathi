'use client';

import { useEffect, useState } from 'react';
import { useStoreStaffContext } from '../context/StoreStaffContext';
import RoleEditorModal from './RoleEditorModal';

const RoleList = ({ onCreateRole }) => {
  const { roles, fetchRoles, deleteRole, loading } = useStoreStaffContext();
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleDelete = async (role) => {
    if (!confirm(`Delete custom role "${role.name}"? This cannot be undone.`)) return;
    await deleteRole(role._id);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button
          onClick={onCreateRole}
          style={{ padding: '10px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Create Custom Role
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: 32 }}>Loading roles...</p>
        ) : roles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
            <p style={{ color: '#6b7280', fontWeight: 500 }}>No roles yet</p>
          </div>
        ) : (
          roles.map(role => (
            <div key={role._id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{role.name}</span>
                  {role.isSystem && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6d28d9', background: '#ede9fe', padding: '2px 8px', borderRadius: 20 }}>System</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>
                  {role.permissions?.length || 0} permissions assigned
                </p>
              </div>
              {!role.isSystem && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditingRole(role)} style={{ padding: '7px 14px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(role)} style={{ padding: '7px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Role Modal */}
      <RoleEditorModal
        isOpen={Boolean(editingRole)}
        onClose={() => setEditingRole(null)}
        editingRole={editingRole}
      />
    </div>
  );
};

export default RoleList;
