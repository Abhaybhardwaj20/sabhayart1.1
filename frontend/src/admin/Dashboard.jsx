import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { formatPrice } from '../utils/currencyFormatter';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../utils/constants';
import './Dashboard.css';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-icon" style={{ background: color + '18', color }}>
      {icon}
    </div>
    <div className="dash-stat-body">
      <span className="dash-stat-label">{label}</span>
      <span className="dash-stat-value">{value}</span>
      {sub && <span className="dash-stat-sub">{sub}</span>}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats,  setStats]  = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, oRes] = await Promise.all([
          API.get(ENDPOINTS.ADMIN_ANALYTICS),
          API.get(ENDPOINTS.ADMIN_ORDERS + '?limit=5&sort=newest'),
        ]);
        setStats(sRes.data);
        setOrders(oRes.data?.orders || oRes.data || []);
      } catch {
        // use mock data if API not ready yet
        setStats({ revenue: 284500, orders: 38, products: 124, users: 312, revenueChange: '+12%', ordersChange: '+5' });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-sub">Welcome back. Here's what's happening today.</p>
          </div>
          <Link to="/admin/add-product" className="btn-primary" style={{ fontSize: '0.82rem', padding: '12px 24px' }}>
            + Add Product
          </Link>
        </div>

        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : (
          <>
            <div className="dash-stats-grid">
              <StatCard icon="₹" label="Total Revenue"  value={formatPrice(stats?.revenue  ?? 0)} sub={stats?.revenueChange} color="#c9a84c" />
              <StatCard icon="📦" label="Total Orders"  value={stats?.orders   ?? 0}              sub={stats?.ordersChange}  color="#60a5fa" />
              <StatCard icon="🎨" label="Products"      value={stats?.products ?? 0}              sub="Active listings"       color="#a78bfa" />
              <StatCard icon="👥" label="Customers"     value={stats?.users    ?? 0}              sub="Registered users"      color="#34d399" />
            </div>

            <div className="dash-bottom-grid">
              {/* Recent Orders */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Recent Orders</span>
                  <Link to="/admin/orders" className="dash-card-link">View all →</Link>
                </div>
                {orders.length === 0 ? (
                  <p className="dash-empty">No orders yet.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td><Link to={`/admin/orders`} className="dash-link">#{o._id?.slice(-6).toUpperCase()}</Link></td>
                          <td>{o.user?.name || o.shippingAddress?.fullName || '—'}</td>
                          <td>{formatPrice(o.totalAmount)}</td>
                          <td>
                            <span className="status-pill" style={{
                              background: (ORDER_STATUS_COLORS[o.status] || '#888') + '18',
                              color: ORDER_STATUS_COLORS[o.status] || '#888',
                            }}>
                              {ORDER_STATUS_LABELS[o.status] || o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quick Links */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Quick Actions</span>
                </div>
                <div className="dash-quick-links">
                  {[
                    { to: '/admin/add-product',  icon: '➕', label: 'Add New Product' },
                    { to: '/admin/orders',        icon: '📦', label: 'Manage Orders' },
                    { to: '/admin/products',      icon: '🎨', label: 'Manage Products' },
                    { to: '/admin/coupons',       icon: '🏷️', label: 'Create Coupon' },
                    { to: '/admin/reviews',       icon: '⭐', label: 'Moderate Reviews' },
                    { to: '/admin/analytics',     icon: '📈', label: 'View Analytics' },
                  ].map(l => (
                    <Link key={l.to} to={l.to} className="dash-quick-link">
                      <span>{l.icon}</span>
                      <span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}