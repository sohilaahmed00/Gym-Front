import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// تعريف متغيرات API
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_ALL_SUBSCRIPTIONS: `${API_BASE_URL}/Subscribes/GetAllSubscribtions`,
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/Users/Getuserbyid/${userId}`
};

// ترجمة أنواع الاشتراكات
const subscriptionTypeLabels = {
  '1_Month': 'شهر واحد',
  '3_Months': '3 أشهر',
  '6_Months': '6 أشهر',
  '1_Year': 'سنة كاملة'
};

// ترجمة حالة الاشتراك
const statusLabels = {
  'Active': 'نشط',
  'Expired': 'منتهي',
  'Pending': 'قيد الانتظار',
  'Rejected': 'مرفوض'
};

export default function ManageSubscriptions() {
  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState({});
  const [coaches, setCoaches] = useState({});
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

  // Fetch user data by ID
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId));
      if (!response.ok) {
        throw new Error(`فشل في جلب بيانات المستخدم: ${userId}`);
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`خطأ في جلب بيانات المستخدم ${userId}:`, error);
      return null;
    }
  };

  // Fetch all users and coaches data from subscriptions
  const fetchUsersData = async (subscriptionsData) => {
    const userPromises = {};
    const coachPromises = {};
    
    // جمع جميع معرفات المستخدمين والمدربين
    subscriptionsData.forEach(subscription => {
      if (subscription.user_ID && !userPromises[subscription.user_ID]) {
        userPromises[subscription.user_ID] = fetchUserData(subscription.user_ID);
      }
      if (subscription.coach_ID && !coachPromises[subscription.coach_ID]) {
        coachPromises[subscription.coach_ID] = fetchUserData(subscription.coach_ID);
      }
    });
    
    // انتظار جميع طلبات API للمستخدمين
    const userResults = await Promise.allSettled(Object.values(userPromises));
    const usersData = {};
    let index = 0;
    for (const userId of Object.keys(userPromises)) {
      if (userResults[index].status === 'fulfilled' && userResults[index].value) {
        usersData[userId] = userResults[index].value;
      }
      index++;
    }
    
    // انتظار جميع طلبات API للمدربين
    const coachResults = await Promise.allSettled(Object.values(coachPromises));
    const coachesData = {};
    index = 0;
    for (const coachId of Object.keys(coachPromises)) {
      if (coachResults[index].status === 'fulfilled' && coachResults[index].value) {
        coachesData[coachId] = coachResults[index].value;
      }
      index++;
    }
    
    setUsers(usersData);
    setCoaches(coachesData);
  };

  // Fetch subscriptions data from API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_SUBSCRIPTIONS);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الاشتراكات');
      }
      const data = await response.json();
      setSubscriptions(data);
      
      // جلب بيانات المستخدمين والمدربين
      await fetchUsersData(data);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
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
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">إدارة الاشتراكات</h4>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              إضافة اشتراك جديد
            </button>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select className="form-select">
                <option value="">جميع الاشتراكات</option>
                <option value="1_Month">شهر واحد</option>
                <option value="3_Months">3 أشهر</option>
                <option value="6_Months">6 أشهر</option>
                <option value="1_Year">سنة كاملة</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">جميع الحالات</option>
                <option value="Active">نشط</option>
                <option value="Pending">قيد الانتظار</option>
                <option value="Expired">منتهي</option>
                <option value="Rejected">مرفوض</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" placeholder="تاريخ البدء" />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" placeholder="تاريخ الانتهاء" />
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-start">رقم الاشتراك</th>
                  <th className="border-0">المستخدم</th>
                  <th className="border-0">المدرب</th>
                  <th className="border-0">نوع الاشتراك</th>
                  <th className="border-0">تاريخ البدء</th>
                  <th className="border-0">تاريخ الانتهاء</th>
                  <th className="border-0">الحالة</th>
                  <th className="border-0">تم الدفع</th>
                  <th className="border-0">تم الموافقة</th>
                  <th className="border-0">إيصال الدفع</th>
                  <th className="border-0">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.subscribe_ID} className="subscription-row">
                    <td className="text-start">
                      <span style={{ fontWeight: 600, fontSize: 16 }}>#{subscription.subscribe_ID}</span>
                    </td>
                    <td>
                      {users[subscription.user_ID] ? (
                        <div className="d-flex align-items-center">
                          {users[subscription.user_ID].applicationUser.image ? (
                            <img 
                              src={`${API_BASE_URL.replace('/api', '')}/Images/$}`} 
                              alt={users[subscription.user_ID].applicationUser.fullName}
                              className="rounded-circle me-2"
                              width="32"
                              height="32"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <span className="avatar-placeholder me-2">
                              <i className="fas fa-user"></i>
                            </span>
                          )}
                          <span>{users[subscription.user_ID].applicationUser.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {coaches[subscription.coach_ID] ? (
                        <div className="d-flex align-items-center">
                          {coaches[subscription.coach_ID].applicationUser.image ? (
                            <img 
                              src={`${API_BASE_URL.replace('/api', '')}/Images/profiles/${coaches[subscription.coach_ID].applicationUser.image}`} 
                              alt={coaches[subscription.coach_ID].applicationUser.fullName}
                              className="rounded-circle me-2"
                              width="32"
                              height="32"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <span className="avatar-placeholder me-2">
                              <i className="fas fa-user-tie"></i>
                            </span>
                          )}
                          <span>{coaches[subscription.coach_ID].applicationUser.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {subscriptionTypeLabels[subscription.subscriptionType] || subscription.subscriptionType}
                      </span>
                    </td>
                    <td>{formatDate(subscription.startDate)}</td>
                    <td>{formatDate(subscription.endDate)}</td>
                    <td>
                      <span className={`badge ${
                        subscription.status === 'Active' ? 'bg-success' : 
                        subscription.status === 'Pending' ? 'bg-warning' : 
                        subscription.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                      } text-white`}>
                        {statusLabels[subscription.status] || subscription.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${subscription.isPaid ? 'bg-success' : 'bg-danger'}`}>
                        {subscription.isPaid ? 'نعم' : 'لا'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${subscription.isApproved ? 'bg-success' : 'bg-danger'}`}>
                        {subscription.isApproved ? 'نعم' : 'لا'}
                      </span>
                    </td>
                    <td>
                      {subscription.paymentProof ? (
                        <a href={`${API_BASE_URL.replace('/api', '')}/Images/${subscription.paymentProof}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="btn btn-sm btn-outline-info">
                          <i className="fas fa-image me-1"></i>
                          عرض
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
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
      </div>
      <style>{`
        .subscription-row:hover { 
          background: #f8f9fa; 
          transition: all 0.2s ease;
        }
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
        .avatar-placeholder {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
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
  );
} 