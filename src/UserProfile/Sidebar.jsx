import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendarCheck, faAppleAlt, faComments,faCog } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const menuItems = [
    { label: 'Home', path: '', icon: faHome },
    { label: 'Training Schedule', path: 'schedule', icon: faCalendarCheck },
    // { label: 'Diet Plan', path: 'diet', icon: faAppleAlt },
    { label: 'Chat Bot', path: 'chat', icon: faComments },
    { label: 'Setting', path: 'settings', icon: faCog },

  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>🧍 User Panel</span>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            end={item.path === ''}
          >
            <FontAwesomeIcon icon={item.icon} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
