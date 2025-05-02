import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { icon: 'fas fa-chart-pie', label: 'Dashboard', path: '/admin' },
  { icon: 'fas fa-users', label: 'Coaches', path: '/admin/coaches' },
  { icon: 'fas fa-user-friends', label: 'Clients', path: '/admin/clients' },
  { icon: 'fas fa-box', label: 'Products', path: '/admin/products' },
  { icon: 'fas fa-credit-card', label: 'Subscriptions', path: '/admin/subscriptions' },
  { icon: 'fas fa-file-alt', label: 'Orders', path: '/admin/orders' },
  { icon: 'fas fa-chart-bar', label: 'Reports', path: '/admin/reports' },
  { icon: 'fas fa-cog', label: 'Settings', path: '/admin/settings' },
];

export default function SideList() {
  return (
    <aside
      className="bg-white border-end"
      style={{
        width: 300,
        minWidth: 250,
        maxWidth: 300,
        minHeight: '100vh',
        transition: 'width 0.2s',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div className="d-flex align-items-center gap-2 p-4 border-bottom" style={{ marginTop: '0px', width: '100%' }}>
        {/* <i className="fas fa-snowflake text-primary fs-4"></i> */}
        <span className="fw-bold fs-5" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}> Admin Panel </span>
      </div>
      <nav className="nav flex-column p-2" style={{ width: '100%' }}>
        {sidebarItems.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 text-dark my-1 rounded px-3 py-2 hover-bg-light" +
              (isActive ? " active bg-primary text-white" : "")
            }
            end={item.path === '/admin'}
            style={{ width: '100%', overflow: 'hidden' }}
          >
            <i className={item.icon}></i>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 