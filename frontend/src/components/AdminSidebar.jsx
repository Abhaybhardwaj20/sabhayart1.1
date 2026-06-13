import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin',            icon: '📊', label: 'Dashboard' },
  { to: '/admin/products',   icon: '🎨', label: 'Products' },
  { to: '/admin/add-product',icon: '➕', label: 'Add Product' },
  { to: '/admin/orders',     icon: '📦', label: 'Orders' },
  { to: '/admin/users',      icon: '👥', label: 'Users' },
  { to: '/admin/reviews',    icon: '⭐', label: 'Reviews' },
  { to: '/admin/coupons',    icon: '🏷️', label: 'Coupons' },
  { to: '/admin/analytics',  icon: '📈', label: 'Analytics' },
];

export default function AdminSidebar() {
  return (
    <aside style={{
      width: '240px', minHeight: 'calc(100vh - var(--nav-h))',
      background: 'rgba(9,12,23,0.97)', borderRight: '1px solid var(--border)',
      position: 'sticky', top: 'var(--nav-h)', height: 'calc(100vh - var(--nav-h))',
      overflowY: 'auto', padding: '28px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 20px', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', padding: '8px' }}>
          Admin Panel
        </span>
      </div>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/admin'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 28px', fontSize: '0.875rem',
            color: isActive ? 'var(--gold2)' : 'var(--soft)',
            background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
            textDecoration: 'none', transition: 'all 0.25s',
            borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
          })}
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </aside>
  );
}