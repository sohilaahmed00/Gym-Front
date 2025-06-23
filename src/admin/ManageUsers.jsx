import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// تعريف متغيرات API
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_ALL_USERS: `${API_BASE_URL}/Users/GetAllUsers`,
  DELETE_USER: `${API_BASE_URL}/Users/DeleteUser`
};

export default function ManageUsers() {
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // Hide alert automatically after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeletingId(userId);
      const response = await fetch(`${API_ENDPOINTS.DELETE_USER}/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(users.filter(user => user.userId !== userId));
        showAlert('User deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      showAlert('An error occurred while deleting the user', 'danger');
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch users data from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_USERS);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المستخدمين');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  // تحديث قائمة المستخدمين عند تغيير الفلاتر
  const filteredUsers = users.filter(user => {
    const matchesGender = !genderFilter || user.gender === genderFilter;
    const matchesSearch = !searchTerm || (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesGender && matchesSearch;
  });

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
console.log(users);
  return (
    <div className="container-fluid py-4">
      {/* Alert Component */}
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show mt-2 mb-3`} role="alert">
          <div className="d-flex align-items-center">
            {alert.type === 'success' ? (
              <i className="fas fa-check-circle me-2"></i>
            ) : alert.type === 'danger' ? (
              <i className="fas fa-exclamation-circle me-2"></i>
            ) : (
              <i className="fas fa-info-circle me-2"></i>
            )}
            <strong>{alert.message}</strong>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlert({ ...alert, show: false })}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">User Management</h4>
          </div>
          
          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select className="form-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="text-start">User</th>
                  <th>User Type</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Goal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="user-row">
                    <td className="text-start">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                        {user.image ? (
                          <img 
                            src={`${API_BASE_URL.replace('/api', '')}/images/profiles/${user.image}`} 
                            alt={user.fullName}
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
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
                        )}
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{user?.fullName}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge user-type-badge bg-info">
                        User
                      </span>
                    </td>
                    <td>{user?.email}</td>
                    <td>{user?.gender === 'Male' ? 'Male' : 'Female'}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {user.fitness_Goal}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(user.userId)}
                        disabled={deletingId === user.userId}
                      >
                        {deletingId === user.userId ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </>
                        )}
                      </button>
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
          .user-type-badge {
            min-width: 70px;
            text-align: center;
            display: inline-block;
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
          .form-select, .form-control {
            border-radius: 8px;
            border: 1px solid #dee2e6;
            padding: 0.5rem 1rem;
            font-size: 14px;
          }
          .form-select:focus, .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          }
          .alert {
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            animation: slideIn 0.4s ease;
          }
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
} 