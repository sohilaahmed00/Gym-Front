import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  // Users state
  const [users, setUsers] = useState([]);

  // Fetch users data from API (mock example)
  useEffect(() => {
    setUsers([
      { id: 1, name: 'Omar Khalid', email: 'omar@email.com', joined: '2023-02-15', status: 'Active' },
      { id: 2, name: 'Mona Adel', email: 'mona@email.com', joined: '2022-12-01', status: 'Active' },
      { id: 3, name: 'Youssef Sami', email: 'youssef@email.com', joined: '2022-10-20', status: 'Inactive' },
    ]);
  }, []);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Users Management</h4>
          <button className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add New User
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th className="text-start">Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="text-start">
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
                    <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'} text-white`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .user-row:hover { background: #f1f3f6; transition: background 0.2s; }
        .badge {
          font-weight: 500;
          padding: 6px 10px;
        }
        .table th {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-group .btn {
          padding: 0.4rem 0.8rem;
        }
      `}</style>
    </div>
  );
} 