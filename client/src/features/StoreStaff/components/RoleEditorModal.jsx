'use client';

import { useState, useEffect } from 'react';
import { PERMISSION_GROUPS } from '@/costant/permissions';
import { useStoreStaffContext } from '../context/StoreStaffContext';

const RoleEditorModal = ({ isOpen, onClose, editingRole = null }) => {
  const { createRole, updateRole } = useStoreStaffContext();
  const [roleName, setRoleName] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(editingRole);

  useEffect(() => {
    if (isOpen) {
      setRoleName(editingRole?.name || '');
      setSelected(new Set(editingRole?.permissions || []));
      setError('');
    }
  }, [isOpen, editingRole]);

  if (!isOpen) return null;

  const toggle = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleGroup = (group) => {
    const allKeys = group.permissions.map(p => p.key);
    const allSelected = allKeys.every(k => selected.has(k));
    setSelected(prev => {
      const next = new Set(prev);
      allKeys.forEach(k => allSelected ? next.delete(k) : next.add(k));
      return next;
    });
  };

  const handleSave = async () => {
    if (!roleName.trim()) { setError('Role name is required'); return; }
    if (selected.size === 0) { setError('Select at least one permission'); return; }
    try {
      setLoading(true);
      setError('');
      const payload = { name: roleName.trim(), permissions: [...selected] };
      isEditing ? await updateRole(editingRole._id, payload) : await createRole(payload);
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 620, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f1f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111' }}>
                {isEditing ? 'Edit Role' : 'Create Custom Role'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                {selected.size} of {PERMISSION_GROUPS.flatMap(g => g.permissions).length} permissions selected
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
          </div>
          {/* Role Name Input */}
          <input
            type="text"
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            placeholder="Role name (e.g., Night Shift Cashier)"
            style={{ marginTop: 16, width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Scrollable Permissions Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {PERMISSION_GROUPS.map(group => {
            const allSelected = group.permissions.every(p => selected.has(p.key));
            const someSelected = group.permissions.some(p => selected.has(p.key));
            return (
              <div key={group.id} style={{ marginBottom: 24 }}>
                {/* Group Header */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}
                  onClick={() => toggleGroup(group)}
                >
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#374151' }}>{group.label}</h3>
                  <span style={{ fontSize: 12, color: allSelected ? '#4f46e5' : someSelected ? '#d97706' : '#9ca3af', fontWeight: 600 }}>
                    {allSelected ? 'All selected' : someSelected ? 'Partial' : 'None'} — Toggle All
                  </span>
                </div>
                {/* Permission Checkboxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {group.permissions.map(perm => (
                    <label
                      key={perm.key}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${selected.has(perm.key) ? '#a5b4fc' : '#e5e7eb'}`, background: selected.has(perm.key) ? '#eef2ff' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(perm.key)}
                        onChange={() => toggle(perm.key)}
                        style={{ width: 16, height: 16, accentColor: '#4f46e5', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: selected.has(perm.key) ? '#4338ca' : '#374151' }}>
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f1f1', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {error && <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>⚠️ {error}</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '12px 0', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : isEditing ? '💾 Update Role' : '✅ Create Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEditorModal;
