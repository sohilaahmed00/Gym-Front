import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCalendarCheck,
  faAppleAlt,
  faComments,
  faCog,
  faArrowLeft,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';
import { API_BASE_URL } from '../config';

const Sidebar = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Subscribes/GetSubscribeByUserId/${localStorage.getItem('id')}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No subscription');
      })
      .then(data => {
        setIsSubscribed(true);
      })
      .catch(() => {
        setIsSubscribed(false);
      });
  }, [localStorage.getItem('id')]);

  const menuItems = [
    { label: 'Home', path: '', icon: faHome },
    ...(isSubscribed
      ? [
          { label: 'Training Schedule', path: 'schedule', icon: faCalendarCheck },
          { label: 'Chat Bot', path: 'chat', icon: faComments },
          { label: 'My Orders', path: 'orders', icon: faAppleAlt },
          { label: 'My Cart', path: 'cart', icon: faShoppingCart },
           { label: 'Contact Admin', path: 'contact-admin', icon: faComments },
        ]
      : []),
    { label: 'Setting', path: 'settings', icon: faCog },
    { label: 'Back Home', path: '/', icon: faArrowLeft },
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
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
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
