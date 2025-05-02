import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageCoaches() {
  // حالة الكوتشز
  const [coaches, setCoaches] = useState([]);

  // جلب بيانات الكوتشز من API (مثال وهمي)
  useEffect(() => {
    setCoaches([
      { id: 1, name: 'Ahmed Ali', specialty: 'Fitness', sessions: 20, rating: 4.8, joined: '2023-01-10' },
      { id: 2, name: 'Sara Mohamed', specialty: 'Yoga', sessions: 15, rating: 4.6, joined: '2022-11-05' },
      { id: 3, name: 'Mohamed Samir', specialty: 'Bodybuilding', sessions: 30, rating: 4.9, joined: '2022-09-20' },
    ]);
  }, []);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h4 className="fw-bold mb-3">Coaches Management</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Sessions</th>
                <th>Rating</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id} className="coach-row">
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: '#0d6efd22',
                        color: '#0d6efd',
                        fontSize: 20,
                        marginRight: 6,
                      }}>
                        <i className="fas fa-user-tie"></i>
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{coach.name}</span>
                    </span>
                  </td>
                  <td>{coach.specialty}</td>
                  <td>{coach.sessions}</td>
                  <td>{coach.rating}</td>
                  <td>{coach.joined}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .coach-row:hover { background: #f1f3f6; transition: background 0.2s; }
      `}</style>
    </div>
  );
} 