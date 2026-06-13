import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './OrderDetails.css';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(ENDPOINTS.ORDER(id))
      .then(({ data }) => setOrder(data.order || data))
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="od-loading"><div className="od-spinner" /></div>;
  if (error) return <div className="od-error"><p>{error}</p><Link to="/orders">Back to orders</Link></div>;
  if (!order) return null;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="od-page">
      <div className="od-back">
        <Link to="/orders">← All orders</Link>
      </div>

      <div className="od-header">
        <div>
          <h1>Order #{order._id?.slice(-8).toUpperCase()}</h1>
          <p className="od-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span className={`od-status od-status--${order.status}`}>
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="od-tracker">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={`od-step${i <= stepIndex ? ' od-step--done' : ''}${i === stepIndex ? ' od-step--active' : ''}`}>
              <div className="od-step-dot" />
              {i < STATUS_STEPS.length - 1 && <div className="od-step-line" />}
              <span className="od-step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="od-body">
        {/* Items */}
        <div className="od-section">
          <h2>Items</h2>
          <div className="od-items">
            {order.items?.map((item, i) => (
              <div key={i} className="od-item">
                <img src={item.image} alt={item.name} className="od-item-img" />
                <div className="od-item-info">
                  <p className="od-item-name">{item.name}</p>
                  <p className="od-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="od-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="od-side">
          {/* Summary */}
          <div className="od-section">
            <h2>Summary</h2>
            <div className="od-summary">
              <div className="od-summary-row"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
              {order.discount > 0 && <div className="od-summary-row od-summary-row--discount"><span>Discount</span><span>−₹{order.discount?.toLocaleString('en-IN')}</span></div>}
              <div className="od-summary-row"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost?.toLocaleString('en-IN')}`}</span></div>
              <div className="od-summary-row od-summary-total"><span>Total</span><span>₹{order.totalAmount?.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="od-section">
            <h2>Delivery address</h2>
            <div className="od-address">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="od-section">
            <h2>Payment</h2>
            <div className="od-payment">
              <span className="od-payment-method">Razorpay</span>
              <span className={`od-payment-status od-payment-status--${order.paymentStatus}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}