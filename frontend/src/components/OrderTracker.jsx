import React from 'react';
import { ORDER_STATUS } from '../utils/constants';

const STEPS = [
  { key: ORDER_STATUS.CONFIRMED,  label: 'Confirmed',   icon: '✓' },
  { key: ORDER_STATUS.PROCESSING, label: 'Processing',  icon: '🎨' },
  { key: ORDER_STATUS.SHIPPED,    label: 'Shipped',     icon: '📦' },
  { key: ORDER_STATUS.DELIVERED,  label: 'Delivered',   icon: '🏠' },
];

export default function OrderTracker({ status }) {
  const currentIdx = STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '24px 0' }}>
      {STEPS.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step.key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `2px solid ${done || active ? 'var(--gold)' : 'var(--border)'}`,
                background: done ? 'var(--gold)' : active ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: done ? '#06080f' : active ? 'var(--gold)' : 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.4s',
              }}>
                {step.icon}
              </div>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--gold)' : done ? 'var(--soft)' : 'var(--muted)', textAlign: 'center' }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < currentIdx ? 'var(--gold)' : 'var(--border)', transition: 'background 0.4s', marginBottom: '22px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}