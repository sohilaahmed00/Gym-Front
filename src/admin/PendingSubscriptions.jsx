import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_ENDPOINTS = {
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/Users/Getuserbyid/${userId}`
};

const PendingSubscriptions = () => {
  // Pending subscriptions state
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plan: '',
    requestDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch user data by ID
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_USER_BY_ID(userId));
      return response.data;
    } catch (error) {
      return null;
    }
  };

  // Fetch subscriptions from real API
  const fetchPendingSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://gymmatehealth.runasp.net/api/Subscribes/pending');
      const subscriptions = response.data.map(subscription => ({
        ...subscription,
        id: subscription.subscribe_ID,
        plan: subscription.subscriptionType,
        requestDate: new Date(subscription.startDate).toISOString().split('T')[0],
        endDate: new Date(subscription.endDate).toISOString().split('T')[0],
        amount: getAmountForPlan(subscription.subscriptionType),
        fitnessGoal: subscription.user?.fitness_Goal || 'Not specified'
      }));
      setPendingSubscriptions(subscriptions);
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
      console.error('Error fetching pending subscriptions:', error);
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
    fetchPendingSubscriptions();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let result = [...pendingSubscriptions];
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
  }, [searchTerm, filters, pendingSubscriptions, users]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Subscribes/approve/${id}`);
      fetchPendingSubscriptions();
    } catch (error) {
      console.error(`Error approving subscription ${id}:`, error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://gymmatehealth.runasp.net/api/Subscribes/reject/${id}`);
      fetchPendingSubscriptions();
    } catch (error) {
      console.error(`Error rejecting subscription ${id}:`, error);
    }
  };

  const availablePlans = [...new Set(pendingSubscriptions.map(sub => sub.plan))];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-orange fw-bold"> Manage Pending Subscriptions</h3>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <input 
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <select 
            value={filters.plan} 
            onChange={(e) => handleFilterChange('plan', e.target.value)} 
            className="form-select"
          >
            <option value="">All Plans</option>
            {availablePlans.map(plan => (
              <option key={plan} value={plan}>{plan === '12_Months' ? '1 Year' : plan.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input 
            type="date" 
            value={filters.requestDate} 
            onChange={(e) => handleFilterChange('requestDate', e.target.value)} 
            className="form-control"
          />
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && filteredSubscriptions.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No pending subscriptions.
        </div>
      ) : !loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">User</th>
                <th scope="col">Gender</th>
                <th scope="col">Plan</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Goal</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub, index) => (
                <tr key={sub.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {users[sub.user_ID] ? (
                      <div className="d-flex align-items-center">
                        {users[sub.user_ID].applicationUser.image ? (
                          <img
                            src={`http://gymmatehealth.runasp.net/Images/profiles/${users[sub.user_ID].applicationUser.image}`}
                            alt={users[sub.user_ID].applicationUser.fullName}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                            style={{ objectFit: 'cover', border: '1.5px solid #dee2e6' }}
                          />
                        ) : (
                          <span className="avatar-placeholder me-2" style={{ width: 32, height: 32, fontSize: 13, border: '1.5px solid #dee2e6' }}>
                            <i className="fas fa-user"></i>
                          </span>
                        )}
                        <span style={{ fontSize: 14 }}>{users[sub.user_ID].applicationUser.fullName}</span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>{users[sub.user_ID]?.gender || '-'}</td>
                  <td>{sub.plan === '12_Months' ? '1 Year' : sub.plan.replace('_', ' ')}</td>
                  <td>{sub.requestDate}</td>
                  <td>{sub.endDate}</td>
                  <td>{sub.fitnessGoal}</td>
                  <td>{sub.amount.toFixed(2)} EGP</td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm py-1 px-2 me-1"
                      style={{ fontSize: '12px', borderRadius: '5px', minWidth: 60 }}
                      onClick={() => handleApprove(sub.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm py-1 px-2"
                      style={{ fontSize: '12px', borderRadius: '5px', minWidth: 60 }}
                      onClick={() => handleReject(sub.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingSubscriptions;