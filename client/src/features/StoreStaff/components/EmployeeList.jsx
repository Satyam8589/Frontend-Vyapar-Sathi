'use client';

import { useEffect } from 'react';
import { useStoreStaffContext } from '../context/StoreStaffContext';

const STATUS_BADGE = {
  active:    { label: 'Active',    color: '#16a34a', bg: '#dcfce7' },
  pending:   { label: 'Invited',   color: '#d97706', bg: '#fef3c7' },
  suspended: { label: 'Suspended', color: '#dc2626', bg: '#fee2e2' },
  rejected:  { label: 'Rejected',  color: '#6b7280', bg: '#f3f4f6' },
};

const EmployeeList = ({ onInvite }) => {
  const { employees, fetchEmployees, removeEmployee, loading } = useStoreStaffContext();

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleRemove = async (employeeId, name) => {
    if (!confirm(`Remove ${name} from this store?`)) return;
    await removeEmployee(employeeId);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f1f1' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Staff Members</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{employees.length} total employees</p>
        </div>
        <button
          onClick={onInvite}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Invite Employee
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Loading staff...</div>
      ) : employees.length === 0 ? (
        <div style={{ padding: 64, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <p style={{ color: '#6b7280', fontWeight: 500 }}>No employees yet</p>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>Invite your first staff member to get started</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Employee', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const badge = STATUS_BADGE[emp.status] || STATUS_BADGE.pending;
              return (
                <tr key={emp._id} style={{ borderTop: '1px solid #f1f1f1' }}>
                  {/* Employee Info */}
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#4f46e5' }}>
                        {emp.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{emp.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{emp.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', background: '#ede9fe', color: '#6d28d9', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                      {emp.role?.name || 'No Role'}
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', background: badge.bg, color: badge.color, borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                      {badge.label}
                    </span>
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '16px 24px', fontSize: 13, color: '#6b7280' }}>
                    {emp.joinedAt ? new Date(emp.joinedAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '16px 24px' }}>
                    <button
                      onClick={() => handleRemove(emp._id, emp.user?.name)}
                      style={{ padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
