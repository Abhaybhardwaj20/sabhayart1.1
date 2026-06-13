import React from 'react';
import PaintingCard from './PaintingCard';
import { paintings } from '../data/paintings';

export default function RelatedProducts({ currentId, category }) {
  const related = paintings
    .filter(p => p.id !== currentId && p.category === category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div style={{ padding: '64px 0 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>More like this</p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--white)' }}>Related <em style={{ fontStyle: 'italic', color: 'var(--gold2)', fontWeight: 300 }}>Works</em></h3>
      </div>
      <div className="grid">
        {related.map(p => <PaintingCard key={p.id} painting={p} />)}
      </div>
    </div>
  );
}