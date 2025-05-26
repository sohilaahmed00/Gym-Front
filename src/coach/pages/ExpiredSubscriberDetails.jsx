import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import subscribers from '../data/subscribers.json';

const ExpiredSubscriberDetails = () => {
  const { id } = useParams();
  const user = subscribers.find((s) => s.id === id && s.status === 'expired');

  const isReportEditable = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.floor((now - end) / (1000 * 60 * 60 * 24));
    return diff <= 7;
  };

  const [notes, setNotes] = useState(
    localStorage.getItem(`report_notes_${id}`) ||
      'User showed solid performance throughout the plan. Needs to stretch more.'
  );

  const handleSave = () => {
    localStorage.setItem(`report_notes_${id}`, notes);
    alert('PDF Report Saved ✅');
  };

  if (!user) return <div className="container mt-4">User not found.</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4" style={{ color: '#fd5c28' }}>📋 {user.name}'s Report</h3>

      {/* Basic Info */}
      <div className="d-flex align-items-center mb-3">
        <img src={user.image} alt={user.name} className="rounded-circle me-3" style={{ width: '60px', height: '60px' }} />
        <div>
          <h5 className="mb-0">{user.name}</h5>
          <small className="text-muted">{user.plan}</small>
          <p className="mb-1"><strong>Subscription:</strong> {user.startDate} → {user.endDate}</p>
        </div>
      </div>

      {/* Progress + Ratings */}
      <div className="row mb-4">
        <div className="col-md-4">
          <h6>Progress</h6>
          <div className="progress" style={{ height: '20px' }}>
            <div className="progress-bar bg-success" style={{ width: `${user.progress || 80}%` }}>
              {user.progress || 80}%
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h6>Coach's Rating</h6>
          <div style={{ color: '#fd5c28', fontSize: '1.2rem' }}>
            {'★'.repeat(user.coachRating || 4)}{'☆'.repeat(5 - (user.coachRating || 4))}
          </div>
        </div>

        <div className="col-md-4">
          <h6>User's Rating</h6>
          <div style={{ color: '#7b6ef6', fontSize: '1.2rem' }}>
            {'★'.repeat(user.userRating || 5)}{'☆'.repeat(5 - (user.userRating || 5))}
          </div>
        </div>
      </div>

      {/* Final Report */}
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
          localStorage.setItem(`report_notes_${user.id}`, notes);
          alert('Report saved successfully ✅');
        }}
        className="btn btn-sm btn-primary"
      >
        💾 Save PDF
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


      {/* Calendar View */}
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
                  const completedDays = user.completedDays?.[weekIndex] || [];

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
                              backgroundColor: completedDays.includes(day) ? '#adb5bd' : '#e9ecef',
                              color: completedDays.includes(day) ? 'white' : '#6c757d',
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
