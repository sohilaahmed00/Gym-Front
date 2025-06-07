import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/Users/Getuserbyid/${userId}`
};

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

const RejectedSubscriptions = () => {
  // Rejected subscriptions state
  const [rejectedSubscriptions, setRejectedSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plan: '',
    requestDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch user data by ID
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_USER_BY_ID(userId));
      return response.data;
    } catch (error) {
      return null;
    }
  };

  // Fetch rejected subscriptions from API
  const fetchRejectedSubscriptions = async () => {
    setLoading(true);
    try {
      // TODO: استبدال هذا الـ endpoint بالـ API الصحيح للاشتراكات المرفوضة
      const response = await axios.get('http://gymmatehealth.runasp.net/api/Subscribes/rejected');
      const subscriptions = response.data.map(subscription => ({
        ...subscription,
        id: subscription.subscribe_ID,
        plan: subscription.subscriptionType,
        requestDate: new Date(subscription.startDate).toISOString().split('T')[0],
        endDate: new Date(subscription.endDate).toISOString().split('T')[0],
        amount: getAmountForPlan(subscription.subscriptionType),
        fitnessGoal: subscription.user?.fitness_Goal || 'Not specified'
      }));
      setRejectedSubscriptions(subscriptions);
      setFilteredSubscriptions(subscriptions);

      // Collect all user_IDs
      const userIds = [...new Set(subscriptions.map(sub => sub.user_ID).filter(Boolean))];
      // Fetch all users data
      const userResults = await Promise.all(userIds.map(id => fetchUserData(id)));
      const usersObj = {};
      userIds.forEach((id, idx) => {
        if (userResults[idx]) usersObj[id] = userResults[idx];
      });
      setUsers(usersObj);
    } catch (error) {
      console.error('Error fetching rejected subscriptions:', error);
      setAlert({ show: true, type: 'danger', message: 'Error fetching rejected subscriptions' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get amount based on plan type
  const getAmountForPlan = (planType) => {
    switch(planType) {
      case '3_Months':
        return 600.00;
      case '6_Months':
        return 1200.00;
      case '12_Months':
        return 1800.00;
      default:
        return 0.00;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRejectedSubscriptions();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let result = [...rejectedSubscriptions];
    if (filters.plan) {
      result = result.filter(subscription => subscription.plan === filters.plan);
    }
    if (filters.requestDate) {
      result = result.filter(subscription => subscription.requestDate === filters.requestDate);
    }
    if (searchTerm) {
      result = result.filter(subscription =>
        (users[subscription.user_ID]?.applicationUser?.fullName && users[subscription.user_ID].applicationUser.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subscription.fitnessGoal && subscription.fitnessGoal.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subscription.plan && subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredSubscriptions(result);
  }, [searchTerm, filters, rejectedSubscriptions, users]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleShow = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const availablePlans = [...new Set(rejectedSubscriptions.map(sub => sub.plan))];

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
            <h4 className="fw-bold mb-0">Rejected Subscriptions</h4>
          </div>
          
          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select 
                value={filters.plan} 
                onChange={(e) => handleFilterChange('plan', e.target.value)} 
                className="form-select"
              >
                <option value="">All Plans</option>
                {availablePlans.map(plan => (
                  <option key={plan} value={plan}>
                    {plan === '12_Months' ? '1 Year' : plan.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input 
                type="date" 
                value={filters.requestDate} 
                onChange={(e) => handleFilterChange('requestDate', e.target.value)} 
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input 
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          
          {loading && <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}
          {!loading && filteredSubscriptions.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No rejected subscriptions.
            </div>
          ) : !loading && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-start">User</th>
                    <th>Gender</th>
                    <th>Plan</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Goal</th>
                    <th>Amount</th>
                    <th>Payment Proof</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub, index) => (
                    <tr key={sub.id} className="subscription-row">
                      <td className="text-start">
                        {users[sub.user_ID] ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                            {users[sub.user_ID].applicationUser.image ? (
                              <img
                                src={`http://gymmatehealth.runasp.net/Images/profiles/${users[sub.user_ID].applicationUser.image}`}
                                alt={users[sub.user_ID].applicationUser.fullName}
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
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{users[sub.user_ID].applicationUser.fullName}</span>
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{users[sub.user_ID]?.gender || '-'}</td>
                      <td>
                        <span className="badge bg-primary">
                          {sub.plan === '12_Months' ? '1 Year' : sub.plan.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{sub.requestDate}</td>
                      <td>{sub.endDate}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {sub.fitnessGoal}
                        </span>
                      </td>
                      <td>{sub.amount.toFixed(2)} EGP</td>
                      <td>
                        {sub.paymentProof ? (
                          <img
                            src={`http://gymmatehealth.runasp.net/Images/PaymentProofs/${sub.paymentProof}`}
                            alt="Payment Proof"
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: '8px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: '2px solid #dee2e6'
                            }}
                            onClick={() => handleShow(`http://gymmatehealth.runasp.net/Images/PaymentProofs/${sub.paymentProof}`)}
                          />
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-danger">
                          <i className="fas fa-times me-1"></i>
                          Rejected
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <style>{`
          .subscription-row:hover { 
            background: #f1f3f6; 
            transition: background 0.2s; 
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
      <PaymentProofModal show={showModal} handleClose={handleClose} imageUrl={currentImage} />
    </div>
  );
};

export default RejectedSubscriptions; 