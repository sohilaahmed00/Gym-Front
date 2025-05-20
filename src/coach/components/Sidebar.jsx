import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const coachId = localStorage.getItem('id');
  console.log(coachId);
  
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [showNotif, setShowNotif] = useState(false);
  const [showMsgs, setShowMsgs] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount, setMsgCount] = useState(5);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`http://gymmatehealth.runasp.net/api/Subscribes/coach/${coachId}`);
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        const data = await response.json();
  
        const transformed = data.map((item) => ({
          id: item.userId,
          name: item.userName,
          email: item.userEmail,
          plan: 'Standard',
          status: 'active',
          hasNewMessage: false,
          ...item,
        }));
  
        setSubscribers(transformed);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
      }
    };
  
    if (coachId) fetchSubscribers();
  }, [coachId]);
  

  const activeSubscribers = subscribers.filter((s) => s.status === 'active');

  const filtered = activeSubscribers.filter((sub) =>
    (planFilter === 'All' || sub.plan === planFilter) &&
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const plans = ['All', ...new Set(activeSubscribers.map((s) => s.plan))];

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
    <div
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        borderRight: '1px solid #ddd',
        padding: '20px',
        overflowY: 'auto',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
        zIndex: 1000,
      }}
    >
      <h4 className="text-center mb-3 fw-bold" style={{ color: '#fd5c28', fontFamily: 'Poppins, sans-serif' }}>
        Coach Panel
      </h4>

      {/* Icons */}
      <div className="d-flex justify-content-around mb-4 position-relative">
        {/* 🔔 Notification */}
        <div className="position-relative">
          <i
            className="bi bi-bell-fill fs-5"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowNotif(!showNotif);
              setShowMsgs(false);
            }}
          ></i>
          {notifCount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">{notifCount}</span>
          )}

          {showNotif && (
            <div className="position-absolute bg-white shadow-sm rounded p-2"
              style={{ width: '220px', top: '30px', left: '-20px', zIndex: 2000 }}>
              <small className="fw-bold">You have {notifCount} new alerts</small>
              <ul className="list-unstyled mt-2 mb-0">
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('feedback')}>💡 New feedback added</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('userPlan')}>🔥 User finished a plan</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleNotificationClick('expired')}>📦 Plan expired for Sarah</li>
              </ul>
            </div>
          )}
        </div>

        {/* 💬 Messages */}
        <div className="position-relative">
          <i
            className="bi bi-chat-dots-fill fs-5"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowMsgs(!showMsgs);
              setShowNotif(false);
            }}
          ></i>
          {msgCount > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">{msgCount}</span>
          )}

          {showMsgs && (
            <div className="position-absolute bg-white shadow-sm rounded p-2"
              style={{ width: '240px', top: '30px', right: '-10px', zIndex: 2000 }}>
              <small className="fw-bold">Recent Messages</small>
              <ul className="list-unstyled mt-2 mb-0">
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Ahmed Mostafa')}>📩 Ahmed: Need help on push ups</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Mohamed Ali')}>📩 Mohamed: Thank you coach!</li>
                <li style={{ cursor: 'pointer' }} onClick={() => handleMessageClick('Sohila Ahmed')}>📩 Sohila: Subscription ended</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Nav */}
      <NavLink
        to="/coach"
        className="d-block mb-4 text-decoration-none fw-medium"
        style={({ isActive }) => ({
          color: isActive ? '#0d6efd' : '#333',
        })}
      >
        <i className="bi bi-bar-chart-fill me-2"></i> Dashboard
      </NavLink>

      {/* Search */}
      <input
        className="form-control mb-2"
        placeholder="🔍 Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter */}
      <select
        className="form-select mb-3"
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
      >
        {plans.map((plan) => (
          <option key={plan} value={plan}>{plan}</option>
        ))}
      </select>

      {/* Subscriber List */}
      <h6 className="fw-bold mb-2">Subscribers</h6>
      <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <p className="text-muted">No subscribers found.</p>
        ) : (
          filtered.map((sub) => (
            <div
              key={sub.id}
              className="p-2 rounded mb-2 d-flex justify-content-between align-items-center shadow-sm"
              style={{
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onClick={() => navigate(`/coach/subscriber/${sub.id}`, { state: { subscriber: sub } })}
              >
              <span>{sub.name}</span>
              {sub.hasNewMessage && <span className="text-danger fs-6">●</span>}
            </div>
          ))
        )}
        <NavLink
          to="/coach/setting"
          className="d-block mb-4 text-decoration-none fw-medium"
          style={({ isActive }) => ({
            color: isActive ? '#0d6efd' : '#333',
          })}
        >
          <i className="bi bi-bar-setting me-2"></i>⚙️ Setting
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
