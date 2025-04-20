import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import subscribers from '../data/subscribers.json';

const SubscriberDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = subscribers.find((s) => s.id === id);

  const [completedDays, setCompletedDays] = useState(user.completedDays || {});
  const [showChat, setShowChat] = useState(false);
  const [dietPlan, setDietPlan] = useState(user.dietPlan || 'Balanced nutrition plan with high protein intake.');
  const [attachments, setAttachments] = useState(user.attachments || []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Open chat if state passed from notification
  useEffect(() => {
    if (location.state?.openChat) {
      setShowChat(true);
      window.history.replaceState({}, document.title); // prevent modal reopen on refresh
    }
  }, [location.state]);

  // Load messages from localStorage per user
  useEffect(() => {
    const stored = localStorage.getItem(`chat_user_${user.id}`);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([]);
    }
  }, [user.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = [...messages, { sender: 'coach', text: newMessage, time }];
    setMessages(updated);
    localStorage.setItem(`chat_user_${user.id}`, JSON.stringify(updated));
    setNewMessage('');
  };

  const handleToggleDay = (weekIndex, day) => {
    setCompletedDays((prev) => {
      const currentWeek = prev[weekIndex] || [];
      const updatedWeek = currentWeek.includes(day)
        ? currentWeek.filter((d) => d !== day)
        : [...currentWeek, day];
      return { ...prev, [weekIndex]: updatedWeek };
    });
  };

  const getProgress = () => {
    let total = 0;
    Object.values(completedDays).forEach((week) => {
      total += week.length;
    });
    return Math.floor((total / 36) * 100);
  };

  const getWeekStatus = (weekIndex, weekStart) => {
    const today = new Date();
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const completed = completedDays[weekIndex]?.length || 0;
    if (today > end) {
      if (completed === 0) return 'missed';
      if (completed < 3) return 'incomplete';
    }
    return 'ok';
  };

  const weeks = [...Array(12)];

  const groupWeeksInRows = () => {
    return weeks.reduce((rows, _, index) => {
      if (index % 3 === 0) rows.push([]);
      rows[rows.length - 1].push(index);
      return rows;
    }, []);
  };

  return (
    <div className="container position-relative">

      {/* Chat Sidebar */}
      {showChat && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: '#fff',
          border: '2px solid #fd5c28',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            background: '#fd5c28',
            color: '#fff',
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>💬 Chat with {user.name}</span>
            <button
              onClick={() => setShowChat(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {messages.length === 0 ? (
              <div className="text-muted text-center">No messages yet...</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${msg.sender === 'coach' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                >
                  <div style={{
                    backgroundColor: msg.sender === 'coach' ? '#fd5c28' : '#e2e3e5',
                    color: msg.sender === 'coach' ? '#fff' : '#000',
                    padding: '10px 14px',
                    borderRadius: '20px',
                    maxWidth: '70%',
                  }}>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: 4 }}>{msg.time}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid #eee' }}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
              <textarea
                className="form-control mb-2"
                rows="2"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button type="submit" className="btn btn-sm w-100" style={{ backgroundColor: '#fd5c28', color: '#fff' }}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded shadow-sm" style={{ backgroundColor: '#fff' }}>
        <div className="d-flex align-items-center gap-3">
          <img src={user.image} alt={user.name} className="rounded-circle border" style={{ width: '70px', height: '70px' }} />
          <div>
            <h3 className="fw-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#222' }}>{user.name}</h3>
            <div className="text-muted" style={{ fontSize: '14px' }}>{user.plan} • {user.startDate} → {user.endDate}</div>
            <div className="mt-2">
              <div><strong>💪 Condition:</strong> {user.condition || 'Good stamina with average flexibility'}</div>
              <div><strong>🎯 Goal:</strong> {user.goal || 'Fat loss and muscle gain'}</div>
              <div><strong>⭐ Experience:</strong> {user.level || 'Beginner'}</div>
            </div>
          </div>
        </div>
        <button
          className="btn btn-outline-warning rounded-pill px-4"
          onClick={() => setShowChat(!showChat)}
        >
          🗨️ Chat
        </button>
      </div>

      {/* Diet Plan */}
      <div className="mb-4">
        <h6 className="text-orange">🥗 Diet Plan</h6>
        <textarea
          className="form-control border-orange"
          rows="4"
          value={dietPlan}
          onChange={(e) => setDietPlan(e.target.value)}
        />
        <button className="btn btn-sm btn-warning mt-2">💾 Save Changes</button>
      </div>

      {/* Attachments */}
      <div className="mb-4">
        <h6 className="text-orange">📎 Attachments</h6>
        {attachments.length === 0 ? (
          <p className="text-muted">No attachments provided by the user.</p>
        ) : (
          <ul className="list-group">
            {attachments.map((file, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {file.name}
                <a href={file.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">View</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Progress */}
      <h6 className="text-orange">📈 Progress</h6>
      <div className="progress mb-4" style={{ height: '20px' }}>
        <div className="progress-bar" style={{ width: `${getProgress()}%`, backgroundColor: '#fd5c28' }}>
          {getProgress()}%
        </div>
      </div>

      {/* Weekly Training */}
      <h5 className="text-orange mb-3">📅 Weekly Training</h5>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {groupWeeksInRows().map((weekRow, rowIndex) => (
          <div key={rowIndex} className="d-flex gap-3 mb-4">
            {weekRow.map((weekIndex) => {
              const weekStart = new Date(user.startDate);
              weekStart.setDate(weekStart.getDate() + weekIndex * 7);
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);

              const weekStatus = getWeekStatus(weekIndex, weekStart);
              const isWeekEnabled = weekIndex === 0 || (completedDays[weekIndex - 1]?.length === 3);

              return (
                <div key={weekIndex} className="border rounded p-2 flex-fill shadow-sm" style={{ minWidth: '200px', borderColor: '#fd5c28' }}>
                  <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
                    Week {weekIndex + 1}<br />
                    <small className="text-muted">({weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()})</small>
                  </div>
                  <div className="d-flex gap-2">
                    {[1, 2, 3].map((day) => {
                      const selected = completedDays[weekIndex]?.includes(day);
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded text-center border ${selected ? 'text-white' : 'text-dark'}`}
                          style={{
                            width: '80px',
                            backgroundColor: selected ? '#fd5c28' : '#f8f9fa',
                            cursor: isWeekEnabled ? 'pointer' : 'not-allowed',
                            opacity: isWeekEnabled ? 1 : 0.5
                          }}
                          onClick={() => isWeekEnabled && handleToggleDay(weekIndex, day)}
                        >
                          Day {day}
                        </div>
                      );
                    })}
                  </div>

                  {weekStatus === 'missed' && (
                    <div className="mt-3">
                      <button className="btn btn-danger btn-sm">Send Strong Warning 🚨</button>
                    </div>
                  )}
                  {weekStatus === 'incomplete' && (
                    <div className="mt-3">
                      <button className="btn btn-warning btn-sm">Send Gentle Reminder ⚠️</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriberDetails;
