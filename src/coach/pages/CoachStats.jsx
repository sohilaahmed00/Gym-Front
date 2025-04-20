import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import subscribers from '../data/subscribers.json';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#fd5c28', '#7b6ef6'];

const CoachStats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showMsgs, setShowMsgs] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Show modal if coming from sidebar
  useEffect(() => {
    if (location.state?.openFeedback) {
      setShowFeedback(true);
      window.history.replaceState({}, document.title);

    }
  }, [location.state]);

  const ratings = [5, 4, 4, 3, 5];
  const averageRating = (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1);

  const adminFeedbacks = [
    { id: 1, date: '2025-04-15', message: 'You haven’t responded to user feedback in 3 days.' },
    { id: 2, date: '2025-04-18', message: 'Workout plan flagged by 2 users. Review it.' },
    { id: 3, date: '2025-04-20', message: 'Good progress. Submit weekly reports on time.' },
  ];

  const active = subscribers.filter((s) => s.status === 'active');
  const expired = subscribers.filter((s) => s.status === 'expired');

  const allDates = subscribers.map((s) => new Date(s.startDate));
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...subscribers.map((s) => new Date(s.endDate))));

  const pieData = [
    { name: 'Active', value: active.length },
    { name: 'Expired', value: expired.length },
  ];

  const lineData = [
    { month: 'Jan', subscribers: 2 },
    { month: 'Feb', subscribers: 4 },
    { month: 'Mar', subscribers: 6 },
    { month: 'Apr', subscribers: 3 },
  ];

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: '#fd5c28' }}>Overview</h3>

        {/* <div className="d-flex gap-4 position-relative">
          <div className="position-relative">
            <i
              className="bi bi-bell-fill fs-5"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowNotif(!showNotif)}
            ></i>
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">3</span>
            {showNotif && (
              <div className="position-absolute bg-white shadow-sm rounded p-2" style={{ width: '200px', top: '30px', right: 0 }}>
                <small>You have 3 new alerts</small>
                <ul className="list-unstyled mt-2 mb-0">
                  <li style={{ cursor: 'pointer' }} onClick={() => navigate('/coach', { state: { openFeedback: true } })}>💡 New feedback added</li>
                  <li onClick={() => navigate(`/coach/subscriber/2`)}>🔥 User finished a plan</li>
                  <li onClick={() => navigate('/coach/expired')}>📦 Plan expired for Sarah</li>
                </ul>
              </div>
            )}
          </div>

          <div className="position-relative">
            <i
              className="bi bi-chat-dots-fill fs-5"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowMsgs(!showMsgs)}
            ></i>
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">5</span>
            {showMsgs && (
              <div className="position-absolute bg-white shadow-sm rounded p-2" style={{ width: '220px', top: '30px', right: 0 }}>
                <small>Recent Messages</small>
                <ul className="list-unstyled mt-2 mb-0">
                  <li onClick={() => navigate('/coach/subscriber/1', { state: { openChat: true } })}>📩 John: Need help on push ups</li>
                  <li onClick={() => navigate('/coach/subscriber/2', { state: { openChat: true } })}>📩 Adam: Thank you coach!</li>
                </ul>
              </div>
            )}
          </div>
        </div> */}
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <h6>Active Subscribers</h6>
            <h3 className="text-success">{active.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/coach/expired')}>
            <h6>Expired Subscribers</h6>
            <h3 className="text-danger">{expired.length}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <h6>Subscription Range</h6>
            <p className="mb-0"><strong>From:</strong> {minDate.toLocaleDateString()}</p>
            <p className="mb-0"><strong>To:</strong> {maxDate.toLocaleDateString()}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm text-center">
            <h6>Avg Rating</h6>
            <div style={{ fontSize: '1.2rem', color: '#fd5c28' }}>
              {'★'.repeat(Math.floor(averageRating)) + '☆'.repeat(5 - Math.floor(averageRating))}
              <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                {averageRating} from {ratings.length} ratings
              </div>
            </div>
            <button onClick={() => setShowFeedback(true)} className="btn btn-sm btn-outline-secondary mt-2">View Admin Feedback</button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm">
            <h6>Active vs Expired</h6>
            <PieChart width={250} height={250}>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm">
            <h6>Subscribers Over Time</h6>
            <LineChart width={300} height={250} data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="subscribers" stroke="#fd5c28" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        </div>
      </div>

      {/* Admin Feedback Modal */}
      {showFeedback && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 rounded shadow-sm" style={{ width: '450px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h5 className="mb-3">Admin Feedback</h5>
            {adminFeedbacks.map((f) => (
              <div key={f.id} className="mb-3 border-bottom pb-2">
                <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{f.date}</div>
                <div>{f.message}</div>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-4">
              <button onClick={() => alert('Opening admin chat...')} className="btn btn-outline-primary btn-sm">
                Contact Admin
              </button>
              <button onClick={() => setShowFeedback(false)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachStats;
