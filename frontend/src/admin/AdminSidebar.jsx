import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const NAV_GROUPS = [
  {
    heading: 'Overview',
    links: [
      { to: '/admin',           icon: '📊', label: 'Dashboard' },
      { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
    ],
  },
  {
    heading: 'Catalogue',
    links: [
      { to: '/admin/products',    icon: '🎨', label: 'Products' },
      { to: '/admin/add-product', icon: '➕', label: 'Add Product', badge: 'New' },
    ],
  },
  {
    heading: 'Operations',
    links: [
      { to: '/admin/orders',  icon: '📦', label: 'Orders' },
      { to: '/admin/users',   icon: '👥', label: 'Users' },
      { to: '/admin/reviews', icon: '⭐', label: 'Reviews' },
      { to: '/admin/coupons', icon: '🏷️', label: 'Coupons' },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      {NAV_GROUPS.map((group, gi) => (
        <React.Fragment key={group.heading}>
          {gi > 0 && <div className="admin-sidebar-divider" />}
          <span className="admin-sidebar-label">{group.heading}</span>
          {group.links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                'admin-sidebar-link' + (isActive ? ' active' : '')
              }
            >
              <span className="admin-sidebar-icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && (
                <span className="admin-sidebar-badge">{link.badge}</span>
              )}
            </NavLink>
          ))}
        </React.Fragment>
      ))}
    </aside>
  );
}