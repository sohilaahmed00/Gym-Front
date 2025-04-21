import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { label: 'Home', path: '' },
    { label: 'Training Schedule', path: 'schedule' },
    { label: 'Diet Plan', path: 'diet' },
    { label: 'Chat with Coach', path: 'chat' },
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #ddd',
      padding: '20px',
      boxShadow: '2px 0 6px rgba(0,0,0,0.05)'
    }}>
      <h4 className="text-center fw-bold mb-4" style={{ color: '#fd5c28' }}>
        🧍 User Panel
      </h4>

      <nav className="d-flex flex-column gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `fw-medium text-decoration-none ${isActive ? 'text-primary' : 'text-dark'}`
            }
          >
            ▸ {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
