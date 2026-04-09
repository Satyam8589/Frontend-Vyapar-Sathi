'use client';

import { useState, useEffect } from 'react';
import { useStoreStaffContext } from '../context/StoreStaffContext';

const InviteEmployeeModal = ({ isOpen, onClose }) => {
  const { roles, fetchRoles, inviteEmployee } = useStoreStaffContext();
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setEmail('');
      setRoleId('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, fetchRoles]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !roleId) {
      setError('Please provide both email and role.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await inviteEmployee({ email, roleId });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err?.message || 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111' }}>Invite Employee</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Send an invitation by email with a specific role</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontWeight: 600, color: '#16a34a', fontSize: 16 }}>Invitation Sent!</p>
            <p style={{ color: '#6b7280', fontSize: 13 }}>They will appear as "Invited" until they accept.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Employee Email *
              </label>
              <input
                type="email"
                placeholder="raju@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Assign Role *
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                style={{ ...inputStyle, background: '#fff' }}
                required
              >
                <option value="">— Select a Role —</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>
                    {role.name} {role.isSystem ? '(Default)' : '(Custom)'}
                  </option>
                ))}
              </select>
              {roleId && (
                <p style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
                  📋 {roles.find(r => r._id === roleId)?.permissions?.length || 0} permissions assigned to this role
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, padding: '12px 0', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 1, padding: '12px 0', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Sending...' : '📧 Send Invite'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteEmployeeModal;
