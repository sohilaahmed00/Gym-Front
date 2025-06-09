import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { icon: 'fas fa-chart-pie', label: 'Dashboard', path: '/admin' },
  { icon: 'fas fa-user-tie', label: 'Coaches', path: '/admin/coaches' },
  { icon: 'fas fa-users', label: 'Clients', path: '/admin/clients' },
  { icon: 'fas fa-box-open', label: 'Products', path: '/admin/products' },
  { icon: 'fas fa-id-card', label: 'Subscriptions', path: '/admin/subscriptions' },
  { icon: 'fas fa-clock', label: 'Pending Subscriptions', path: '/admin/pending-subscriptions' },
  { icon: 'fas fa-times-circle', label: 'Rejected Subscriptions', path: '/admin/rejected-subscriptions' },
  { icon: 'fas fa-user-clock', label: 'Pending Coaches', path: '/admin/pending-coaches' },
  { icon: 'fas fa-dumbbell', label: 'Exercise Categories', path: '/admin/exercise-categories' },
  { icon: 'fas fa-running', label: 'Manage Exercises', path: '/admin/exercises' },
  { icon: 'fas fa-box', label: 'Manage Product Orders', path: '/admin/manage-orders' },
  // { icon: 'fas fa-cog', label: 'Settings', path: '/admin/settings' },
];

const settingsDropdown = [
  { icon: 'fas fa-user-cog', label: 'Account Settings', path: '/admin/settings/account' },
  { icon: 'fas fa-sitemap', label: 'Site Settings', path: '/admin/settings/site' },
  { icon: 'fas fa-credit-card', label: 'Payment Settings', path: '/admin/settings/payment' },
  { icon: 'fas fa-cogs', label: 'System Settings', path: '/admin/settings/system' },
  { icon: 'fas fa-file-alt', label: 'Content Settings', path: '/admin/settings/content' },
];

export default function SideList({ pendingSubscriptionsCount = 0, pendingCoachesCount = 0 }) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <aside
      className="bg-white border-end"
      style={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        minHeight: '100vh',
        transition: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <div className="d-flex align-items-center gap-2 p-4 border-bottom" style={{ marginTop: '0px', width: '100%' }}>
        {/* <i className="fas fa-snowflake text-primary fs-4"></i> */}
        <span className="fw-bold fs-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}> Admin Panel </span>
      </div>
      <nav className="nav flex-column p-2" style={{ width: '100%' }}>
        <style>{`
          .nav-link {
            position: relative;
            overflow: visible;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            left: 16px;
            right: 16px;
            bottom: 6px;
            height: 2px;
            background: linear-gradient(to right, #ff6600, #ff3300);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
            border-radius: 2px;
          }
          .nav-link:hover:not(.active)::after {
            transform: scaleX(1);
          }
        `}</style>
        {sidebarItems.map((item, idx) => {
          if (item.label === 'Settings') {
            return (
              <div key={idx} className="position-relative">
                <div
                  className={`nav-link d-flex align-items-center gap-2 my-1 rounded px-3 py-2 ${showSettings ? 'active' : ''}`}
                  style={{ width: '100%', cursor: 'pointer', color: '#333' }}
                  onClick={() => setShowSettings((prev) => !prev)}
                >
                  <i className={item.icon} style={{ color: 'inherit' }}></i>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  <i className={`fas fa-chevron-${showSettings ? 'up' : 'down'} ms-auto`}></i>
                </div>
                {showSettings && (
                  <div style={{ background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 8, marginTop: 2, marginLeft: 10 }}>
                    {settingsDropdown.map((sub, subIdx) => (
                      <NavLink
                        to={sub.path}
                        key={subIdx}
                        className={({ isActive }) =>
                          `nav-link d-flex align-items-center gap-2 px-4 py-2 ${isActive ? 'active' : ''}`
                        }
                        style={({ isActive }) => ({
                          color: isActive ? '#fff' : '#333',
                          background: isActive ? '#ff7a00' : 'transparent',
                          borderRadius: 6,
                          fontSize: 15,
                          margin: '2px 0',
                        })}
                      >
                        <i className={sub.icon}></i>
                        <span>{sub.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          // ديناميكي للبادج
          let badge = null;
          if (item.label === 'Pending Subscriptions') {
            badge = (
              <span className="badge bg-danger rounded-pill ms-auto" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', backgroundColor: '#ff7a00 !important', minWidth: '28px', textAlign: 'center', display: 'inline-block' }}>
                {pendingSubscriptionsCount}
              </span>
            );
          } else if (item.label === 'Pending Coaches') {
            badge = (
              <span className="badge bg-danger rounded-pill ms-auto" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', backgroundColor: '#ff7a00 !important', minWidth: '28px', textAlign: 'center', display: 'inline-block' }}>
                {pendingCoachesCount}
              </span>
            );
          }
          return (
            <NavLink
              to={item.path}
              key={idx}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 my-1 rounded px-3 py-2 ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                width: '100%',
                overflow: 'hidden',
                backgroundColor: isActive ? '#ff7a00' : 'transparent',
                color: isActive ? '#fff' : '#333',
                transition: 'all 0.3s ease'
              })}
              end={item.path === '/admin'}
            >
              <i className={item.icon} style={{ color: 'inherit' }}></i>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
              {badge}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
} 