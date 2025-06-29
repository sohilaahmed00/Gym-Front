import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaDumbbell, FaShoppingCart, FaUsers, FaCog, FaBell, FaCommentDots,FaMoneyBillWave } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../../config';

const Sidebar = () => {
  const navigate = useNavigate();
  const coachId = localStorage.getItem('id');

  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [showNotif, setShowNotif] = useState(false);
  const [showMsgs, setShowMsgs] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount, setMsgCount] = useState(5);

  const plans = ['All', '3_Months', '6_Months', '1_Year'];

  const formatPlan = (plan) => ({
    'All': 'All Plans',
    '3_Months': '3 Months',
    '6_Months': '6 Months',
    '1_Year': '1 Year'
  }[plan] || 'Unknown');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Subscribes/coach/${coachId}`);
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        const data = await response.json();
        console.log(data, "dd");

        const transformed = data.map((item) => ({
          id: item.user_ID || item.userId,
          name: item.user?.applicationUser?.fullName || item.userName,
          email: item.user?.applicationUser?.email || item.userEmail,
          plan: item.subscriptionType || 'Unknown',
          status: item.status || 'active',
          hasNewMessage: false,
          image: item.user?.applicationUser?.image
            ? `${API_BASE_IMAGE_URL}/images/User/${item.user.applicationUser.image}`
            : null,
          ...item,
        }));

        setSubscribers(transformed);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
      }
    };

    if (coachId) fetchSubscribers();
  }, [coachId]);

  const activeSubscribers = subscribers.filter((s) => s.status.toLowerCase() === 'active');

  const filtered = activeSubscribers.filter((sub) =>
    (planFilter === 'All' || sub.plan === planFilter) &&
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNotificationClick = (type) => {
    setShowNotif(false);
    setNotifCount((prev) => Math.max(prev - 1, 0));
    if (type === 'feedback') {
      navigate('/coach', { state: { openFeedback: true } });
    } else if (type === 'expired') {
      navigate('/coach/expired');
    } else if (type === 'userPlan') {
      const user = subscribers.find((s) => s.name === 'Adam Ali');
      if (user) navigate(`/coach/subscriber/${user.id}`);
    }
  };

  const handleMessageClick = (name) => {
    setShowMsgs(false);
    setMsgCount((prev) => Math.max(prev - 1, 0));
    const user = subscribers.find((s) => s.name === name);
    if (user) navigate(`/coach/subscriber/${user.id}`, { state: { openChat: true } });
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Coach Panel</h3>

      <nav>
        <NavLink
          to="/coach"
          end
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaUsers />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/coach/exercise"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaDumbbell />
          <span>Exercises</span>
        </NavLink>
        <NavLink
          to="/coach/products"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaShoppingCart />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/coach/payments"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaMoneyBillWave />
          <span>Payments</span>
        </NavLink>
        <NavLink
          to="/coach/setting"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaCog />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/coach/contact-admin"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaCommentDots />
          <span>Contact Admin</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <FaHome />
          <span>Back Home</span>
        </NavLink>
      </nav>

      <hr />

      <div style={{ flexShrink: 0 }}>
        <input
          type="text"
          placeholder="🔍 Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className={styles.planFilter}
        >
          {plans.map(plan => (
            <option key={plan} value={plan}>
              {formatPlan(plan)}
            </option>
          ))}
        </select>

        <h6 style={{ marginTop: 20, fontWeight: '700', color: '#333' }}>Subscribers</h6>
        <div className={styles.subscriberList}>
          {filtered.length === 0 ? (
            <p style={{ color: '#666', fontSize: 14, padding: '10px 0' }}>No subscribers found.</p>
          ) : (
            filtered.map((sub) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/coach/subscriber/${sub.id}`, { state: { subscriber: sub } })}
                className={styles.subscriberItem}
                title={sub.email}
              >
                <div className={styles.subscriberNameContainer}>
                  {sub.image ? (
                    <img src={`${API_BASE_IMAGE_URL}/images/profiles/${sub.image}`} alt={sub.name} className={styles.userImage} />
                  ) : (
                    <div
                      className={styles.userImage}
                      style={{ backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                  )}
                  <span>{sub.name}</span>
                </div>
                {sub.hasNewMessage && <span className={styles.newMessageDot}>●</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
