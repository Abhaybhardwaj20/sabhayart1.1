import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecentlyViewed({ currentId }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sabhaya_recently_viewed') || '[]');
      setItems(saved.filter(p => p.id !== currentId).slice(0, 4));
    } catch { setItems([]); }
  }, [currentId]);

  if (items.length === 0) return null;

  return (
    <div style={{ padding: '48px 0 0' }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--white)', marginBottom: '24px' }}>
        Recently Viewed
      </h3>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`)}
            style={{
              flexShrink: 0, width: '160px', cursor: 'pointer',
              border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden',
              transition: 'transform 0.3s', background: 'var(--card)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} onError={e => e.target.style.opacity='0.3'} />
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--white)', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>₹{item.price?.toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}