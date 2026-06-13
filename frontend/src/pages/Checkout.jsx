import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartTotal, selectDiscountedTotal } from '../redux/cartSlice';
import { validateCheckout } from '../utils/validation';
import { calcShipping } from '../utils/shipping';
import './Checkout.css';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh'];

export default function Checkout() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const items       = useSelector(s => s.cart.items);
  const subtotal    = useSelector(selectCartTotal);
  const discount    = useSelector(s => s.cart.discount);
  const discountAmt = discount ? Math.round((subtotal * discount) / 100) : 0;

  const [payMethod, setPayMethod] = useState('cod');
  const [form,      setForm]      = useState({ name:'', email:'', phone:'', address:'', city:'', state:'', pincode:'' });
  const [errors,    setErrors]    = useState({});
  const [placing,   setPlacing]   = useState(false);

  const { shipping } = calcShipping(subtotal, payMethod === 'cod');
  const codCharge    = payMethod === 'cod' ? 49 : 0;
  const total        = subtotal - discountAmt + shipping + codCharge;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handlePlaceOrder = async () => {
    const errs = validateCheckout(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    dispatch(clearCart());
    navigate('/orders', { state: { success: true } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Address */}
          <div className="checkout-left">
            <div className="checkout-section">
              <h3 className="section-head">Delivery Address</h3>
              <div className="form-grid">
                {[
                  { name:'name',    label:'Full Name',     type:'text',  col:2 },
                  { name:'email',   label:'Email',         type:'email', col:1 },
                  { name:'phone',   label:'Phone Number',  type:'tel',   col:1 },
                  { name:'address', label:'Street Address',type:'text',  col:2 },
                  { name:'city',    label:'City',          type:'text',  col:1 },
                  { name:'pincode', label:'Pincode',       type:'text',  col:1 },
                ].map(f => (
                  <div key={f.name} className={`form-group ${f.col === 2 ? 'col-2' : ''}`}>
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      className={errors[f.name] ? 'error' : ''}
                      placeholder={f.label}
                    />
                    {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
                  </div>
                ))}
                <div className="form-group">
                  <label>State</label>
                  <select name="state" value={form.state} onChange={handleChange} className={errors.state ? 'error' : ''}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-error">{errors.state}</span>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <h3 className="section-head">Payment Method</h3>
              <div className="pay-options">
                {[
                  { id:'cod',      icon:'💵', label:'Cash on Delivery', sub:'Pay when delivered (+₹49)' },
                  { id:'razorpay', icon:'💳', label:'Pay Online',       sub:'UPI, Cards, Net Banking' },
                ].map(opt => (
                  <label key={opt.id} className={`pay-option ${payMethod === opt.id ? 'active' : ''}`}>
                    <input type="radio" name="pay" value={opt.id} checked={payMethod === opt.id} onChange={e => setPayMethod(e.target.value)} />
                    <span className="pay-icon">{opt.icon}</span>
                    <div>
                      <div className="pay-label">{opt.label}</div>
                      <div className="pay-sub">{opt.sub}</div>
                    </div>
                    {payMethod === opt.id && <span className="pay-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-right">
            <div className="order-summary-box">
              <h3 className="section-head">Order Summary</h3>
              <div className="order-items">
                {items.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.title} onError={e => e.target.style.opacity='0.3'} />
                    <div className="order-item-info">
                      <div className="order-item-name">{item.title}</div>
                      <div className="order-item-qty">× {item.qty}</div>
                    </div>
                    <div className="order-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <div className="order-divider" />
              {[
                { label: 'Subtotal',  val: `₹${subtotal.toLocaleString('en-IN')}` },
                ...(discountAmt > 0 ? [{ label: 'Discount', val: `-₹${discountAmt.toLocaleString('en-IN')}`, green: true }] : []),
                { label: 'Shipping',  val: shipping === 0 ? 'FREE' : `₹${shipping}` },
                ...(codCharge > 0    ? [{ label: 'COD Fee',   val: `₹${codCharge}` }] : []),
              ].map((row, i) => (
                <div key={i} className={`sum-row ${row.green ? 'green' : ''}`}>
                  <span>{row.label}</span>
                  <span>{row.val}</span>
                </div>
              ))}
              <div className="sum-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Placing Order…' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
              </button>
              <p className="checkout-note">🔐 100% secure checkout · Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}