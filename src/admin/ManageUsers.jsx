import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// تعريف متغيرات API
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_ALL_USERS: `${API_BASE_URL}/Users/GetAllUsers`
};

export default function ManageUsers() {
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // إخفاء التنبيه تلقائيًا بعد 3 ثوان
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
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

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

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
            aria-label="إغلاق"
          ></button>
        </div>
      )}
      
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">إدارة المستخدمين</h4>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              إضافة مستخدم جديد
            </button>
          </div>
          
          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select className="form-select">
                <option value="">جميع الأنواع</option>
                <option value="0">مدير</option>
                <option value="1">طبيب</option>
                <option value="2">مستخدم</option>
                <option value="3">مدرب</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">حسب الجنس</option>
                <option value="Male">ذكر</option>
                <option value="Female">أنثى</option>
              </select>
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="بحث عن مستخدمين..." />
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="text-start">المستخدم</th>
                  <th>نوع المستخدم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الجنس</th>
                  <th>الهدف</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="user-row">
                    <td className="text-start">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                        {user.applicationUser.image ? (
                          <img 
                            src={`${API_BASE_URL.replace('/api', '')}/Images/${user.applicationUser.image}`} 
                            alt={user.applicationUser.fullName}
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
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{user.applicationUser.fullName}</span>
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.applicationUser.userType === 0 ? 'bg-danger' :
                        user.applicationUser.userType === 1 ? 'bg-primary' :
                        user.applicationUser.userType === 2 ? 'bg-info' :
                        'bg-success'
                      }`}>
                        {user.applicationUser.userType === 0 ? 'مدير' : 
                         user.applicationUser.userType === 1 ? 'طبيب' : 
                         user.applicationUser.userType === 2 ? 'مستخدم' : 
                         'مدرب'}
                      </span>
                    </td>
                    <td>{user.applicationUser.email}</td>
                    <td>{user.gender === 'Male' ? 'ذكر' : 'أنثى'}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {user.fitness_Goal}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-edit me-1"></i>
                          تعديل
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash me-1"></i>
                          حذف
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