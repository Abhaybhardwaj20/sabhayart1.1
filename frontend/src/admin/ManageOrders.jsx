import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { formatPrice } from '../utils/currencyFormatter';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../utils/constants';
import './Dashboard.css';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];

export default function ManageOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [expanded, setExpanded] = useState(null);
  const PER_PAGE = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (filter) params.append('status', filter);
      if (search) params.append('search', search);
      const { data } = await API.get(`${ENDPOINTS.ADMIN_ORDERS}?${params}`);
      setOrders(data.orders || data || []);
      setTotal(data.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`${ENDPOINTS.ADMIN_ORDERS}/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch {
      alert('Failed to update status.');
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Orders</h1>
            <p className="admin-page-sub">{total} total orders</p>
          </div>
        </div>

        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search by order ID, customer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
          <select className="admin-select" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="admin-loading">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">No orders found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <React.Fragment key={o._id}>
                    <tr
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    >
                      <td>
                        <span style={{ color: 'var(--gold)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          #{o._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.88rem' }}>
                          {o.user?.name || o.shippingAddress?.fullName || '—'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                          {o.user?.email || ''}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td>{o.items?.length || o.orderItems?.length || '—'}</td>
                      <td>
                        <span style={{ color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
                          {formatPrice(o.totalAmount)}
                        </span>
                      </td>
                      <td>
                        <span className="status-pill" style={{
                          background: (ORDER_STATUS_COLORS[o.status] || '#888') + '18',
                          color: ORDER_STATUS_COLORS[o.status] || '#888',
                        }}>
                          {ORDER_STATUS_LABELS[o.status] || o.status}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <select
                          className="admin-select"
                          value={o.status}
                          style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                          onChange={e => updateStatus(o._id, e.target.value)}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === o._id && (
                      <tr>
                        <td colSpan={7} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.82rem' }}>
                            <div>
                              <p style={{ color: 'var(--muted)', marginBottom: '8px', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shipping Address</p>
                              <p style={{ color: 'var(--soft)', lineHeight: 1.8 }}>
                                {o.shippingAddress?.fullName}<br />
                                {o.shippingAddress?.address}<br />
                                {o.shippingAddress?.city}, {o.shippingAddress?.state} — {o.shippingAddress?.pincode}<br />
                                📞 {o.shippingAddress?.phone}
                              </p>
                            </div>
                            <div>
                              <p style={{ color: 'var(--muted)', marginBottom: '8px', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Items Ordered</p>
                              {(o.items || o.orderItems || []).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--soft)' }}>
                                  <span>{item.title || item.name} × {item.quantity}</span>
                                  <span style={{ color: 'var(--gold)' }}>{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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