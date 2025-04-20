import React from 'react';
import subscribers from '../data/subscribers.json';

const ExpiredSubscribers = () => {
  const expiredUsers = subscribers.filter((s) => s.status === 'expired');

  const isReportEditable = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffInDays = Math.floor((now - end) / (1000 * 60 * 60 * 24));
    return diffInDays <= 7;
  };

  return (
    <div className="container">
      <h3 className="mb-4" style={{ color: '#fd5c28' }}>Expired Subscribers</h3>

      {expiredUsers.map((user) => (
        <div key={user.id} className="bg-white rounded shadow-sm mb-4 p-3">
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
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6>Progress</h6>
              <div className="progress" style={{ height: '20px' }}>
                <div className="progress-bar bg-success" style={{ width: `${user.progress || 80}%` }}>
                  {user.progress || 80}%
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h6>Coach's Rating for User</h6>
              <div style={{ color: '#fd5c28', fontSize: '1.2rem' }}>
                {'★'.repeat(user.coachRating || 4)}{'☆'.repeat(5 - (user.coachRating || 4))}
              </div>
              <small className="text-muted">"Shows commitment but needs to improve timing."</small>
            </div>

            <div className="col-md-4 mb-3">
              <h6>User's Rating for Coach</h6>
              <div style={{ color: '#7b6ef6', fontSize: '1.2rem' }}>
                {'★'.repeat(user.userRating || 5)}{'☆'.repeat(5 - (user.userRating || 5))}
              </div>
              <small className="text-muted">"Very supportive and motivating coach."</small>
            </div>
          </div>

          {/* Final Report */}
          <div className="mb-3">
            <h6>Final Report (PDF)</h6>
            {isReportEditable(user.endDate) ? (
              <>
                <textarea className="form-control mb-2" rows="4" defaultValue="User showed solid performance throughout the plan. Needs to stretch more."></textarea>
                <button className="btn btn-sm btn-primary">Save PDF</button>
              </>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-muted">Editing time has expired. PDF locked.</p>
                <button className="btn btn-sm btn-outline-secondary">Download PDF</button>
              </div>
            )}
          </div>

          {/* Calendar View */}
         {/* Calendar View */}
<div className="mt-4">
  <h6>Training Summary</h6>

  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
    {
      // نقسم الأسابيع إلى صفوف كل صف فيه 3 أسابيع
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


          {/* Blocked Actions */}
          <div className="alert alert-warning mt-3 mb-0">
            This user's subscription has expired. You can't send messages or assign plans anymore.
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpiredSubscribers;
