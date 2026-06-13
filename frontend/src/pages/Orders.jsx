import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './Orders.css';

const STATUS_COLORS = {
  pending:    { bg: '#fff8e1', color: '#f57c00' },
  confirmed:  { bg: '#e3f2fd', color: '#1565c0' },
  processing: { bg: '#e8eaf6', color: '#3949ab' },
  shipped:    { bg: '#e8f5e9', color: '#2e7d32' },
  delivered:  { bg: '#e8f5e9', color: '#1b5e20' },
  cancelled:  { bg: '#ffebee', color: '#c62828' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(ENDPOINTS.MY_ORDERS)
      .then(({ data }) => setOrders(data.orders || data))
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-loading"><div className="orders-spinner" /></div>;

  if (error) return (
    <div className="orders-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  if (orders.length === 0) return (
    <div className="orders-empty">
      <span className="orders-empty-icon">📦</span>
      <h2>No orders yet</h2>
      <p>Your orders will appear here once you've made a purchase.</p>
      <Link to="/shop" className="orders-cta">Start shopping</Link>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          return (
            <div key={order._id} className="order-card">
              <div className="order-card-top">
                <div>
                  <p className="order-id">Order #{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <span className="order-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>

              <div className="order-items-preview">
                {order.items?.slice(0, 3).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} className="order-item-thumb" title={item.name} />
                ))}
                {order.items?.length > 3 && (
                  <div className="order-item-more">+{order.items.length - 3}</div>
                )}
              </div>

              <div className="order-card-bottom">
                <p className="order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                <Link to={`/orders/${order._id}`} className="order-details-btn">View details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}