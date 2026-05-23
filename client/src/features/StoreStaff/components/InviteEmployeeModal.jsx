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
  const [inviteToken, setInviteToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setEmail('');
      setRoleId('');
      setError('');
      setSuccess(false);
      setInviteToken('');
      setCopied(false);
    }
  }, [isOpen, fetchRoles]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (inviteToken) {
      const inviteUrl = `${window.location.origin}/invite/${inviteToken}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !roleId) {
      setError('Please provide both email and role.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await inviteEmployee({ email, roleId });
      if (res?.data?.inviteToken) {
        setInviteToken(res.data.inviteToken);
      }
      setSuccess(true);
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
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 54, marginBottom: 16 }}>🎉</div>
            <p style={{ fontWeight: 700, color: '#10b981', fontSize: 18, margin: '0 0 8px' }}>Invitation Created!</p>
            <p style={{ color: '#4b5563', fontSize: 13, lineHeight: '1.5', margin: '0 0 20px' }}>
              We attempted to send an invitation email to <strong style={{ color: '#1f2937' }}>{email}</strong>.
              If they don't receive it, you can share the secure link below directly:
            </p>
            
            {inviteToken ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#f3f4f6', 
                borderRadius: 12, 
                padding: '6px 6px 6px 14px', 
                border: '1.5px solid #e5e7eb',
                marginBottom: 24,
                gap: 8
              }}>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/invite/${inviteToken}`}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: 13,
                    color: '#4b5563',
                    fontFamily: 'monospace',
                    textOverflow: 'ellipsis'
                  }}
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '8px 16px',
                    background: copied ? '#10b981' : '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {copied ? 'Copied! ✓' : '📋 Copy Link'}
                </button>
              </div>
            ) : (
              <p style={{ color: '#ef4444', fontSize: 12, marginBottom: 20 }}>
                ⚠️ No invitation link could be generated.
              </p>
            )}

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 0',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Done
            </button>
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
