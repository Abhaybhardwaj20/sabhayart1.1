import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQty, selectCartTotal, selectDiscountedTotal } from '../redux/cartSlice';
import CouponBox from '../components/CouponBox';
import { calcShipping } from '../utils/shipping';
import './Cart.css';

export default function Cart() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const items     = useSelector(s => s.cart.items);
  const subtotal  = useSelector(selectCartTotal);
  const discount  = useSelector(s => s.cart.discount);
  const { shipping } = calcShipping(subtotal);
  const discountAmt = discount ? Math.round((subtotal * discount) / 100) : 0;
  const total = subtotal - discountAmt + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Discover our handcrafted paintings and find one that speaks to you.</p>
        <Link to="/shop" className="btn-primary">Explore Shop →</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="page-title">Shopping <em>Cart</em></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-img"
                  onError={e => e.target.style.opacity='0.3'}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.title}</div>
                  <div className="cart-item-meta">{item.category} · {item.size}</div>
                  <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}>+</button>
                </div>
                <div className="cart-item-total">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                <button className="cart-remove" onClick={() => dispatch(removeFromCart(item.id))}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmt > 0 && (
              <div className="summary-row green">
                <span>Coupon Discount</span>
                <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: '#5dde9a' }}>FREE</span> : `₹${shipping}`}</span>
            </div>
            {subtotal < 999 && <p className="free-ship-note">Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping</p>}

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="coupon-section">
              <div className="coupon-label">Have a coupon?</div>
              <CouponBox />
            </div>

            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>

            <Link to="/shop" className="continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}