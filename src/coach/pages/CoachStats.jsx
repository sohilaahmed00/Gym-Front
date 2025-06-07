import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';

import styles from './CoachStats.module.css'; // Import CSS module

const COLORS = ['#fd5c28', '#7b6ef6'];

const formatDateMonthYear = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
};


const CoachStats = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const coachId = localStorage.getItem('id');

  const [coachName, setCoachName] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubs, setActiveSubs] = useState([]);
  const [expiredSubs, setExpiredSubs] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Static admin feedback and ratings
  const adminFeedbacks = [
    { id: 1, date: '2025-04-15', message: 'You haven’t responded to user feedback in 3 days.' },
    { id: 2, date: '2025-04-18', message: 'Workout plan flagged by 2 users. Review it.' },
    { id: 3, date: '2025-04-20', message: 'Good progress. Submit weekly reports on time.' },
  ];
  const ratings = [5, 4, 4, 3, 5];
  const averageRating = (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1);

  useEffect(() => {
    if (!coachId) return;

    const fetchCoach = async () => {
      try {
        const res = await fetch(`http://gymmatehealth.runasp.net/api/Coaches/GetCoachbyId/${coachId}`);
        if (!res.ok) throw new Error('Failed to fetch coach info');
        const data = await res.json();
        setCoachName(data.applicationUser?.fullName || '');
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoach();
  }, [coachId]);

  useEffect(() => {
    if (!coachId) return;

    const fetchSubs = async () => {
      try {
        const res = await fetch('http://gymmatehealth.runasp.net/api/Subscribes/GetAllSubscribtions');
        if (!res.ok) throw new Error('Failed to fetch subscriptions');
        const data = await res.json();

        const filtered = data.filter(sub => sub.coach_ID === coachId);

        setSubscriptions(filtered);

        const active = filtered.filter(sub => sub.status?.toLowerCase() === 'active');
        const expired = filtered.filter(sub => sub.status?.toLowerCase() === 'expired');

        setActiveSubs(active);
        setExpiredSubs(expired);

      } catch (err) {
        console.error(err);
      }
    };

    fetchSubs();
  }, [coachId]);

  const pieData = [
    { name: 'Active', value: activeSubs.length },
    { name: 'Expired', value: expiredSubs.length },
  ];

  const monthlyCounts = {};
  subscriptions.forEach(sub => {
    if (sub.startDate) {
      const d = new Date(sub.startDate);
      const monthKey = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    }
  });

  const lineData = Object.entries(monthlyCounts)
    .map(([month, count]) => ({ month, subscribers: count }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  const allStartDates = subscriptions.map(s => new Date(s.startDate));
  const allEndDates = subscriptions.map(s => new Date(s.endDate));

  const minDate = allStartDates.length ? new Date(Math.min(...allStartDates)) : null;
  const maxDate = allEndDates.length ? new Date(Math.max(...allEndDates)) : null;

  useEffect(() => {
    if (location.state?.openFeedback) {
      setShowFeedback(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className={styles.container}>
      <h3 className={styles.welcome}>Welcome, {coachName}</h3>

      <div className={styles.statsRow}>
        <div
          className={`${styles.statBox} ${styles.activeBox}`}
          title="Active Subscribers"
        >
          <h6>Active Subscribers</h6>
          <h3>{activeSubs.length}</h3>
        </div>

        <div
          className={`${styles.statBox} ${styles.expiredBox}`}
          title="Expired Subscribers"
          onClick={() => navigate('/coach/expired')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/coach/expired')}
          tabIndex={0}
          role="button"
        >
          <h6>Expired Subscribers</h6>
          <h3>{expiredSubs.length}</h3>
        </div>

        <div className={styles.statBox} title="Subscription Range">
          <h6>Subscription Range</h6>
          <p><strong>From:</strong> {formatDateMonthYear(minDate)}</p>
          <p><strong>To:</strong> {formatDateMonthYear(maxDate)}</p>
        </div>

        <div className={styles.statBox}>
          <h6>Avg Rating</h6>
          <div className={styles.ratingStars}>
            {'★'.repeat(Math.floor(averageRating)) + '☆'.repeat(5 - Math.floor(averageRating))}
          </div>
          <div className={styles.ratingText}>
            {averageRating} from {ratings.length} ratings
          </div>
          <button className={styles.feedbackBtn} onClick={() => setShowFeedback(true)}>
            View Admin Feedback
          </button>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h6>Active vs Expired Subscribers</h6>
          <PieChart width={400} height={250}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>

        <div className={styles.chartBox}>
          <h6>Subscribers Over Time</h6>
          <LineChart width={300} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="subscribers" stroke="#fd5c28" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      </div>

      {showFeedback && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h5>Admin Feedback</h5>
            {adminFeedbacks.map((f) => (
              <div key={f.id} className={styles.feedbackItem}>
                <div className={styles.feedbackDate}>{f.date}</div>
                <div>{f.message}</div>
              </div>
            ))}
            <div className={styles.modalButtons}>
              <button
                onClick={() => alert('Opening admin chat...')}
                className={styles.contactAdminBtn}
              >
                Contact Admin
              </button>
              <button
                onClick={() => setShowFeedback(false)}
                className={styles.closeBtn}
              >
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
