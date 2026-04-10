'use client';

import { useState, useEffect } from 'react';
import { useStoreStaffContext } from '../context/StoreStaffContext';

const EditEmployeeRoleModal = ({ isOpen, onClose, employee }) => {
  const { roles, fetchRoles, updateEmployee } = useStoreStaffContext();
  const [roleId, setRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setRoleId(employee?.role?._id || '');
      setError('');
    }
  }, [isOpen, employee, fetchRoles]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!roleId) {
      setError('Please select a role');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await updateEmployee(employee._id, { role: roleId });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f1f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111' }}>Edit Employee Role</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                Updating role for <strong>{employee?.user?.name || 'Employee'}</strong>
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 28px' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Select New Role
          </label>
          <select
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1.5px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              outline: 'none',
              appearance: 'none',
              background: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center/16px'
            }}
          >
            <option value="">Select a role</option>
            {roles.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          {error && <p style={{ margin: '12px 0 0', fontSize: 13, color: '#dc2626' }}>⚠️ {error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f1f1', display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 0',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 0',
              background: loading ? '#a5b4fc' : '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : '💾 Update Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeRoleModal;
