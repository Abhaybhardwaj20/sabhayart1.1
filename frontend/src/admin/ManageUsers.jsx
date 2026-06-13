import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './Dashboard.css';

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const PER_PAGE = 20;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search) params.append('search', search);
      const { data } = await API.get(`${ENDPOINTS.ADMIN_USERS}?${params}`);
      setUsers(data.users || data || []);
      setTotal(data.total || 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      await API.put(`${ENDPOINTS.ADMIN_USERS}/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert('Failed to update role.');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`${ENDPOINTS.ADMIN_USERS}/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch {
      alert('Failed to delete user.');
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Users</h1>
            <p className="admin-page-sub">{total} registered customers</p>
          </div>
        </div>

        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
          <button className="admin-action-btn" style={{ padding: '10px 20px' }} onClick={() => { setPage(1); load(); }}>
            Search
          </button>
        </div>

        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="admin-loading">Loading users…</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'rgba(201,168,76,0.15)',
                          color: 'var(--gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 600, fontSize: '0.9rem', flexShrink: 0,
                        }}>
                          {(u.name || u.email || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--white)', fontWeight: 500 }}>{u.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--soft)' }}>{u.email}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>{u.orderCount ?? '—'}</td>
                    <td>
                      <span className="status-pill" style={{
                        background: u.role === 'admin' ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.06)',
                        color: u.role === 'admin' ? 'var(--gold)' : 'var(--soft)',
                      }}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="admin-action-btn"
                          onClick={() => toggleRole(u._id, u.role)}
                          title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                        >
                          {u.role === 'admin' ? '↓ User' : '↑ Admin'}
                        </button>
                        <button className="admin-action-btn danger" onClick={() => deleteUser(u._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`admin-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}