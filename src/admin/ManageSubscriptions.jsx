import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// API variables
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_ALL_SUBSCRIPTIONS: `${API_BASE_URL}/Subscribes/GetAllSubscribtions`,
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/Users/Getuserbyid/${userId}`,
  GET_COACH_BY_ID: (coachId) => `${API_BASE_URL}/Coaches/GetCoachbyId/${coachId}`,
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

  // Fetch coach data by ID
  const fetchCoachData = async (coachId) => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_COACH_BY_ID(coachId));
      if (!response.ok) {
        throw new Error(`Failed to fetch coach data: ${coachId}`);
      }
      const coachData = await response.json();
      return coachData;
    } catch (error) {
      console.error(`Error fetching coach data ${coachId}:`, error);
      return null;
    }
  };

  // Fetch all users and coaches data from subscriptions
  const fetchUsersData = async (subscriptionsData) => {
    const userPromises = {};
    const coachPromises = {};
    
    // Collect all user and coach IDs
    subscriptionsData.forEach(subscription => {
      if (subscription.user_ID && !userPromises[subscription.user_ID]) {
        userPromises[subscription.user_ID] = fetchUserData(subscription.user_ID);
      }
      if (subscription.coach_ID && !coachPromises[subscription.coach_ID]) {
        coachPromises[subscription.coach_ID] = fetchCoachData(subscription.coach_ID);
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
    
    setUsers(usersData);
    setCoaches(coachesData);
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
                  <th className="border-0">Specialization</th>
                  <th className="border-0">Subscription Type</th>
                  <th className="border-0">Start Date</th>
                  <th className="border-0">End Date</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Approved</th>
                  <th className="border-0">Payment Proof</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions
                  .filter(subscription => {
                    if (filterType && subscription.subscriptionType !== filterType) return false;
                    if (filterStatus && subscription.status !== filterStatus) return false;

                    if (searchText.trim()) {
                      if (searchBy === 'user') {
                        const userName = users[subscription.user_ID]?.applicationUser?.fullName?.toLowerCase() || '';
                        if (!userName.includes(searchText.trim().toLowerCase())) return false;
                      } else if (searchBy === 'coach') {
                        const coachName = coaches[subscription.coach_ID]?.applicationUser?.fullName?.toLowerCase() || '';
                        if (!coachName.includes(searchText.trim().toLowerCase())) return false;
                      }
                    }
                    return true;
                  })
                  .map((subscription) => (
                    <tr key={subscription.subscribe_ID} className="subscription-row">
                      <td className="align-middle" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {users[subscription.user_ID] ? (
                          <>
                            {users[subscription.user_ID].applicationUser.image ? (
                              <img 
                                src={`${API_BASE_URL.replace('/api', '')}/Images/profiles/${users[subscription.user_ID].applicationUser.image}`} 
                                alt={users[subscription.user_ID].applicationUser.fullName}
                                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: '#6c757d22', color: '#6c757d', fontSize: 20 }}>
                                <i className="fas fa-user"></i>
                              </span>
                            )}
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{users[subscription.user_ID].applicationUser.fullName}</span>
                          </>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        {coaches[subscription.coach_ID] ? (
                          <span style={{ fontWeight: 600, fontSize: 16 }}>
                            {coaches[subscription.coach_ID]?.applicationUser?.fullName || 'N/A'}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        {coaches[subscription.coach_ID] ? (
                          <span className="badge bg-secondary">
                            {coaches[subscription.coach_ID]?.specialization || 'N/A'}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-primary">
                          {subscriptionTypeLabels[subscription.subscriptionType] || subscription.subscriptionType}
                        </span>
                      </td>
                      <td className="align-middle">{formatDate(subscription.startDate)}</td>
                      <td className="align-middle">{formatDate(subscription.endDate)}</td>
                      <td className="align-middle">
                        <span className={`badge ${subscription.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                          {statusLabels[subscription.status] || subscription.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className={`badge ${subscription.isApproved ? 'bg-success' : 'bg-danger'}`}>
                          {subscription.isApproved ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="align-middle">
                        {subscription.paymentProof && (
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleShow(`http://gymmatehealth.runasp.net/Images/PaymentProofs/${subscription.paymentProof}`)}
                          >
                            <i className="fas fa-image me-1"></i>
                            View
                          </button>
                        )}
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
      `}</style>
    </div>
  );
}