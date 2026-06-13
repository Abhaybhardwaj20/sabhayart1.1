import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, removeCoupon } from '../redux/cartSlice';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export default function CouponBox() {
  const dispatch = useDispatch();
  const { coupon, discount } = useSelector(s => s.cart);
  const [code,    setCode]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    const upper = code.trim().toUpperCase();
    if (!upper) { setError('Please enter a coupon code.'); return; }

    setLoading(true);
    setError('');
    try {
      const { data } = await API.post(ENDPOINTS.APPLY_COUPON, { code: upper });
      // Expected response: { code: 'SABHAYA10', discount: 10, type: 'percentage' }
      dispatch(applyCoupon({ code: data.code, discount: data.discount }));
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid coupon code.');
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 18px',
        background: 'rgba(93,222,154,0.08)',
        border: '1px solid rgba(93,222,154,0.2)',
        borderRadius: '12px',
      }}>
        <span style={{ fontSize: '0.85rem', color: '#5dde9a' }}>
          ✓ {coupon} — {discount}% off applied
        </span>
        <button
          onClick={() => dispatch(removeCoupon())}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value); setError(''); }}
          placeholder="Coupon code"
          onKeyDown={e => e.key === 'Enter' && apply()}
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: '10px',
            padding: '11px 16px',
            color: 'var(--white)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.85rem',
            outline: 'none',
            opacity: loading ? 0.6 : 1,
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={apply}
          disabled={loading}
          style={{
            background: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)',
            color: '#06080f',
            border: 'none',
            padding: '0 20px',
            borderRadius: '10px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            minWidth: '72px',
          }}
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
}