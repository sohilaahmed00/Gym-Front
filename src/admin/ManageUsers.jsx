import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  // حالة المستخدمين
  const [users, setUsers] = useState([]);

  // جلب بيانات المستخدمين من API (مثال وهمي)
  useEffect(() => {
    setUsers([
      { id: 1, name: 'Omar Khaled', email: 'omar@email.com', joined: '2023-02-15' },
      { id: 2, name: 'Mona Adel', email: 'mona@email.com', joined: '2022-12-01' },
      { id: 3, name: 'Youssef Samy', email: 'youssef@email.com', joined: '2022-10-20' },
    ]);
  }, []);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h4 className="fw-bold mb-3">Users Management</h4>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="user-row">
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
                        background: '#6c757d22',
                        color: '#6c757d',
                        fontSize: 20,
                        marginRight: 6,
                      }}>
                        <i className="fas fa-user"></i>
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{user.name}</span>
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.joined}</td>
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
        .user-row:hover { background: #f1f3f6; transition: background 0.2s; }
      `}</style>
    </div>
  );
} 