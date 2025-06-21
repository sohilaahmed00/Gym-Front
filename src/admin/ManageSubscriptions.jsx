import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../config';

// API variables
const API_ENDPOINTS = {
  GET_ALL_SUBSCRIPTIONS: `${API_BASE_URL}/Subscribes/GetAllSubscribtions`,
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/Users/Getuserbyid/${userId}`,
  GET_USER_SUBSCRIBES: (userId) => `${API_BASE_URL}/Subscribes/user/${userId}`
};

// Subscription type translations
const subscriptionTypeLabels = {
  '1_Month': '1 Month',
  '3_Months': '3 Months',
  '6_Months': '6 Months',
  '1_Year': '1 Year'
};

// Status translations
const statusLabels = {
  'Active': 'Active',
  'Expired': 'Expired',
  'Pending': 'Pending',
  'Rejected': 'Rejected'
};

// Payment Proof Modal Component
const PaymentProofModal = ({ show, handleClose, imageUrl }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Payment Proof</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <img src={imageUrl} alt="Payment Proof" style={{ width: '100%' }} />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default function ManageSubscriptions() {
  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState({});
  const [coaches, setCoaches] = useState({});
  const [userCoaches, setUserCoaches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Filters State
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchBy, setSearchBy] = useState('user'); // 'user' or 'coach'
  
  // Payment Proof Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // Hide alert automatically after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Payment Proof Modal Functions
  const handleShow = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // Fetch user data by ID
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId));
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${userId}`);
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Error fetching user data ${userId}:`, error);
      return null;
    }
  };

  // Fetch all coaches for a user
  const fetchUserCoaches = async (userId) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_USER_SUBSCRIBES(userId));
      if (!response.ok) return [];
      const subscribes = await response.json();
      // استخرج أسماء المدربين من الاشتراكات
      const coachNames = subscribes
        .map(sub => sub.coachName || (sub.coach && sub.coach.applicationUser && sub.coach.applicationUser.fullName))
        .filter(Boolean);
      return coachNames;
    } catch {
      return [];
    }
  };

  // Fetch all users and coaches data from subscriptions
  const fetchUsersData = async (subscriptionsData) => {
    const userPromises = {};
    const coachPromises = {};
    const userCoachPromises = {};
    
    // Collect all user and coach IDs
    subscriptionsData.forEach(subscription => {
      if (subscription.user_ID && !userPromises[subscription.user_ID]) {
        userPromises[subscription.user_ID] = fetchUserData(subscription.user_ID);
        userCoachPromises[subscription.user_ID] = fetchUserCoaches(subscription.user_ID);
      }
      if (subscription.coach_ID && !coachPromises[subscription.coach_ID]) {
        coachPromises[subscription.coach_ID] = fetchUserData(subscription.coach_ID);
      }
    });
    
    // Wait for all user API requests
    const userResults = await Promise.allSettled(Object.values(userPromises));
    const usersData = {};
    let index = 0;
    for (const userId of Object.keys(userPromises)) {
      if (userResults[index].status === 'fulfilled' && userResults[index].value) {
        usersData[userId] = userResults[index].value;
      }
      index++;
    }
    
    // Wait for all coach API requests
    const coachResults = await Promise.allSettled(Object.values(coachPromises));
    const coachesData = {};
    index = 0;
    for (const coachId of Object.keys(coachPromises)) {
      if (coachResults[index].status === 'fulfilled' && coachResults[index].value) {
        coachesData[coachId] = coachResults[index].value;
      }
      index++;
    }
    
    // Wait for all user coaches API requests
    const userCoachResults = await Promise.allSettled(Object.values(userCoachPromises));
    const userCoachesData = {};
    index = 0;
    for (const userId of Object.keys(userCoachPromises)) {
      if (userCoachResults[index].status === 'fulfilled' && userCoachResults[index].value) {
        userCoachesData[userId] = userCoachResults[index].value;
      } else {
        userCoachesData[userId] = [];
      }
      index++;
    }
    
    setUsers(usersData);
    setCoaches(coachesData);
    setUserCoaches(userCoachesData);
  };

  // Fetch subscriptions data from API
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_SUBSCRIPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      const data = await response.json();
      setSubscriptions(data);
      
      // Fetch user and coach data
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
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
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Manage Subscriptions</h4>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4 align-items-end">
            <div className="col-md-4">
              <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Durations</option>
                <option value="3_Months">3 Months</option>
                <option value="6_Months">6 Months</option>
                <option value="1_Year">1 Year</option>
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-4 d-flex gap-2">
              <input type="text" className="form-control" placeholder={searchBy === 'user' ? 'Search by User Name' : 'Search by Coach Name'} value={searchText} onChange={e => setSearchText(e.target.value)} />
              <select className="form-select w-auto" style={{ minWidth: 120 }} value={searchBy} onChange={e => setSearchBy(e.target.value)}>
                <option value="user">User Name</option>
                <option value="coach">Coach Name</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">User</th>
                  <th className="border-0">Coach</th>
                  <th className="border-0">Subscription Type</th>
                  <th className="border-0">Start Date</th>
                  <th className="border-0">End Date</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Approved</th>
                  <th className="border-0">Payment Proof</th>
                  {/* <th className="border-0">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {subscriptions
                  .filter(subscription => {
                    // فلتر الحالة
                    if (filterStatus && subscription.status !== filterStatus) return false;
                    // فلتر المدة
                    if (filterType && subscription.subscriptionType !== filterType) return false;
                    // لا تعرض pending دائماً
                    if (subscription.status === 'Pending') return false;
                    // فلتر الموافقة
                    if (!subscription.isApproved) return false;
                    // فلتر البحث بالاسم
                    if (searchText.trim()) {
                      if (searchBy === 'user') {
                        const userName = users[subscription.user_ID]?.applicationUser?.fullName?.toLowerCase() || '';
                        if (!userName.includes(searchText.trim().toLowerCase())) return false;
                      } else if (searchBy === 'coach') {
                        const coachNames = (userCoaches[subscription.user_ID] || []).map(c => c.toLowerCase());
                        if (!coachNames.some(name => name.includes(searchText.trim().toLowerCase()))) return false;
                      }
                    }
                    return true;
                  })
                  .map((subscription) => (
                    <tr key={subscription.subscribe_ID} className="subscription-row">
                      <td>
                        {users[subscription.user_ID] ? (
                          <div className="d-flex align-items-center">
                            {users[subscription.user_ID].applicationUser.image ? (
                              <img 
                                src={`${API_BASE_URL.replace('/api', '')}/Images/profiles/${users[subscription.user_ID].applicationUser.image}`} 
                                alt={users[subscription.user_ID].applicationUser.fullName}
                                className="rounded-circle me-2"
                                width="26"
                                height="26"
                                style={{ objectFit: 'cover', border: '1.5px solid #dee2e6' }}
                              />
                            ) : (
                              <span className="avatar-placeholder me-2" style={{ width: 26, height: 26, fontSize: 13, border: '1.5px solid #dee2e6' }}>
                                <i className="fas fa-user"></i>
                              </span>
                            )}
                            <span style={{ fontSize: 14 }}>{users[subscription.user_ID].applicationUser.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {userCoaches[subscription.user_ID] && userCoaches[subscription.user_ID].length > 0 ? (
                          <span style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {userCoaches[subscription.user_ID].map((coach, idx, arr) => (
                              <span key={idx}>
                                {coach}
                                {idx < arr.length - 1 && <span style={{ color: '#888', margin: '0 2px' }}>,</span>}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-primary" style={{ fontSize: 13, height: 22, width: 65, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
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
                        } text-white`} style={{ fontSize: 13, height: 22, width: 65, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
                          {statusLabels[subscription.status] || subscription.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${subscription.isApproved ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: 13, height: 22, width: 65, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7 }}>
                          {subscription.isApproved ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {subscription.paymentProof ? (
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleShow(`${API_BASE_IMAGE_URL}/Images/PaymentProofs/${subscription.paymentProof}`)}
                          >
                            <i className="fas fa-image me-1"></i>
                            View
                          </button>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {/* <button className="btn btn-sm btn-warning text-white d-flex align-items-center p-1 px-2" style={{ fontWeight: 600, fontSize: 13, borderRadius: 6, height: 22, width: 65, gap: '3px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-ban" style={{ fontSize: 13 }}></i>
                          <span style={{ lineHeight: 1 }}>Suspend</span>
                        </button> */}
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
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          font-size: 13px;
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
      <PaymentProofModal show={showModal} handleClose={handleClose} imageUrl={currentImage} />
    </div>
  );
} 