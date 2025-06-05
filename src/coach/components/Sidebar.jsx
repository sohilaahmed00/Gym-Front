import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaDumbbell, FaShoppingCart, FaUsers, FaCog, FaBell, FaCommentDots } from 'react-icons/fa';
import styles from './Sidebar.module.css';

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

  const plans = ['All', '3_Months', '6_Months', '12_Months'];

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`http://gymmatehealth.runasp.net/api/Subscribes/coach/${coachId}`);
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        const data = await response.json();

        const transformed = data.map((item) => ({
          id: item.user_ID || item.userId,
          name: item.user?.applicationUser?.fullName || item.userName,
          email: item.user?.applicationUser?.email || item.userEmail,
          plan: item.subscriptionType || 'Unknown',
          status: item.status || 'active',
          hasNewMessage: false,
          image: item.user?.applicationUser?.image ? 
                 `http://gymmatehealth.runasp.net/images/User/${item.user.applicationUser.image}` : null,
          ...item,
        }));

        setSubscribers(transformed);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
      }
    };
  
    if (coachId) fetchSubscribers();
  }, [coachId]);

  // Filter active subscribers by plan and search
  const activeSubscribers = subscribers.filter((s) => s.status === 'active');

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

      {/* Icons - Notifications & Messages */}
      <div className={styles.iconsWrapper}>
        <div className={styles.iconButton}>
          <FaBell size={24} onClick={() => { setShowNotif(!showNotif); setShowMsgs(false); }} />
          {notifCount > 0 && <span className={styles.badge}>{notifCount}</span>}
          {showNotif && (
            <div className={styles.dropdownMenu}>
              <strong>You have {notifCount} new alerts</strong>
              <ul style={{ paddingLeft: 15, marginTop: 10 }}>
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('feedback')}>💡 New feedback added</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('userPlan')}>🔥 User finished a plan</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('expired')}>📦 Plan expired for Sarah</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.iconButton}>
          <FaCommentDots size={24} onClick={() => { setShowMsgs(!showMsgs); setShowNotif(false); }} />
          {msgCount > 0 && <span className={styles.badge}>{msgCount}</span>}
          {showMsgs && (
            <div className={`${styles.dropdownMenu} ${styles.dropdownMenuRight}`}>
              <strong>Recent Messages</strong>
              <ul style={{ paddingLeft: 15, marginTop: 10 }}>
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Ahmed Mostafa')}>📩 Ahmed: Need help on push ups</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Mohamed Ali')}>📩 Mohamed: Thank you coach!</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Sohila Ahmed')}>📩 Sohila: Subscription ended</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav >
        <NavLink
          to="/coach"
          end
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
        >
          <FaUsers /> Dashboard
        </NavLink>

        <NavLink
          to="/coach/exercise"
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
        >
          <FaDumbbell /> Exercises
        </NavLink>

        <NavLink
          to="/coach/products"
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
        >
          <FaShoppingCart /> Products
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
        >
          <FaHome /> Back Home
        </NavLink>
      </nav>
<hr />
     {/* Search and Plan Filter + Subscribers container */}
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
      <option key={plan} value={plan}>{plan === '12_Months' ? '1 Year' : plan.replace('_', ' ')}</option>
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
              <img src={`http://gymmatehealth.runasp.net/images/profiles/${sub.image}`} alt={sub.name} className={styles.userImage} />
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
