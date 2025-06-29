import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ExpiredSubscriberDetails = () => {
  const { id } = useParams();
  const coachId = localStorage.getItem('id');

  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Subscribes/coach/${coachId}`);
        if (!res.ok) throw new Error('Failed to fetch subscriptions');
        const data = await res.json();

        const subscriber = data.find(
          (s) => s.subscribe_ID === parseInt(id) && s.status?.toLowerCase() === 'expired'
        );
        setUser(subscriber || null);

        const savedNotes = localStorage.getItem(`report_notes_${id}`);
        setNotes(
          savedNotes ||
          'User showed solid performance throughout the plan. Needs to stretch more.'
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriber();
  }, [coachId, id]);

  const isReportEditable = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.floor((now - end) / (1000 * 60 * 60 * 24));
    return diff <= 7;
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!user) return <div className="container mt-4">User not found.</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4" style={{ color: '#fd5c28' }}>📋 {user.userName}'s Report</h3>

      {/* Basic Info */}
      <div className="d-flex align-items-center mb-3">
        {user.image && (
          <img
            src={user.image}
            alt={user.userName}
            className="rounded-circle me-3"
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          />
        )}
        <div>
          <h5 className="mb-0">{user.userName}</h5>
          <small className="text-muted">{user.subscriptionType || 'No plan specified'}</small>
          <p className="mb-1">
            <strong>Subscription:</strong>{' '}
            {new Date(user.startDate).toLocaleDateString()} →{' '}
            {new Date(user.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <h6>🎯 Fitness Goal</h6>
          <p>{user.fitness_Goal || 'Not specified'}</p>
        </div>
        <div className="col-md-4 mb-2">
          <h6>📏 Height / Weight</h6>
          <p>{user.height || 'N/A'} cm / {user.weight || 'N/A'} kg</p>
        </div>
        <div className="col-md-4 mb-2">
          <h6>🧬 Gender / Age</h6>
          <p>{user.gender || 'N/A'} — {user.bDate ? new Date().getFullYear() - new Date(user.bDate).getFullYear() : 'N/A'} yrs</p>
        </div>
        <div className="col-md-4 mb-2">
          <h6>⚕️ Medical Conditions</h6>
          <p>{user.medicalConditions || 'None'}</p>
        </div>
        <div className="col-md-4 mb-2">
          <h6>🍽️ Allergies</h6>
          <p>{user.allergies || 'None'}</p>
        </div>
      </div>

      {/* Final Report */}
      <div className="mb-4">
        <h6>📄 Final Report</h6>
        {isReportEditable(user.endDate) ? (
          <>
            <textarea
              className="form-control mb-2"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={() => {
                localStorage.setItem(`report_notes_${user.subscribe_ID}`, notes);
                alert('Report saved successfully ✅');
              }}
              className="btn btn-sm btn-primary"
            >
              💾 Save Report
            </button>
          </>
        ) : (
          <div className="border p-3 bg-light rounded">
            <p className="mb-2">{notes}</p>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Editing time has expired. Report is locked.</small>
              <button className="btn btn-sm btn-outline-secondary">📥 Download PDF</button>
            </div>
          </div>
        )}
      </div>

      {/* Calendar View (Optional mockup) */}
      <div className="mt-4">
        <h6>📅 Training Summary</h6>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {
            [...Array(12)].reduce((rows, _, index) => {
              if (index % 3 === 0) rows.push([]);
              rows[rows.length - 1].push(index);
              return rows;
            }, []).map((weekRow, rowIndex) => (
              <div key={rowIndex} className="d-flex gap-3 mb-4">
                {weekRow.map((weekIndex) => {
                  const weekStart = new Date(user.startDate);
                  weekStart.setDate(weekStart.getDate() + weekIndex * 7);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekEnd.getDate() + 6);

                  return (
                    <div key={weekIndex} className="border rounded p-2 flex-fill" style={{ minWidth: '200px' }}>
                      <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
                        Week {weekIndex + 1}
                        <br />
                        <small className="text-muted">
                          ({weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()})
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {[1, 2, 3].map((day) => (
                          <div
                            key={day}
                            className="p-2 rounded text-center flex-fill"
                            style={{
                              backgroundColor: '#e9ecef',
                              color: '#6c757d',
                              opacity: 0.8,
                              pointerEvents: 'none',
                            }}
                          >
                            Day {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          }
        </div>
      </div>

      {/* Alert */}
      <div className="alert alert-warning mt-4">
        This user's subscription has expired. You can't send messages or assign plans anymore.
      </div>
    </div>
  );
};

export default ExpiredSubscriberDetails;
