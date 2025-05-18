import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const PendingSubscriptions = () => {
  // Pending subscriptions state
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plan: '',
    requestDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch subscriptions from real API
  const fetchPendingSubscriptions = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://gymmatehealth.runasp.net/api/Subscribes/pending');
      
      // Transform API data to match component structure
      const transformedData = response.data.map(subscription => {
        return {
          id: subscription.subscribe_ID,
          clientName: subscription.user?.userId || 'Unknown User',
          gender: subscription.user?.gender || 'Unknown',
          plan: subscription.subscriptionType,
          requestDate: new Date(subscription.startDate).toISOString().split('T')[0],
          endDate: new Date(subscription.endDate).toISOString().split('T')[0],
          amount: getAmountForPlan(subscription.subscriptionType),
          status: subscription.status,
          isPaid: subscription.isPaid,
          isApproved: subscription.isApproved,
          paymentProof: subscription.paymentProof,
          user_ID: subscription.user_ID,
          coach_ID: subscription.coach_ID,
          fitnessGoal: subscription.user?.fitness_Goal || 'Not specified'
        };
      });

      setPendingSubscriptions(transformedData);
      setFilteredSubscriptions(transformedData);
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
        return 550.00;
      case '6_Months':
        return 1000.00;
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

    // Apply plan filter
    if (filters.plan) {
      result = result.filter(subscription => subscription.plan === filters.plan);
    }
    // Apply request date filter
    if (filters.requestDate) {
      result = result.filter(subscription => subscription.requestDate === filters.requestDate);
    }
    // Apply search term filter
    if (searchTerm) {
        result = result.filter(subscription => 
            (subscription.clientName && subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subscription.fitnessGoal && subscription.fitnessGoal.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (subscription.plan && subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    setFilteredSubscriptions(result);
  }, [searchTerm, filters, pendingSubscriptions]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://gymmatehealth.runasp.net/api/Subscribes/approve/${id}`);
      // Update local state after successful API call
      fetchPendingSubscriptions();
    } catch (error) {
      console.error(`Error approving subscription ${id}:`, error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://gymmatehealth.runasp.net/api/Subscribes/reject/${id}`);
      // Update local state after successful API call
      fetchPendingSubscriptions();
    } catch (error) {
      console.error(`Error rejecting subscription ${id}:`, error);
    }
  };

  // Get available plan types from the data
  const availablePlans = [...new Set(pendingSubscriptions.map(sub => sub.plan))];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-orange fw-bold">⏳ الاشتراكات المعلقة</h3>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <input 
            type="text"
            placeholder="بحث..."
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
            <option value="">كل الخطط</option>
            {availablePlans.map(plan => (
              <option key={plan} value={plan}>{plan.replace('_', ' ')}</option>
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

      {loading && <p>جاري التحميل...</p>}
      {!loading && filteredSubscriptions.length === 0 ? (
        <div className="alert alert-info" role="alert">
          لا توجد اشتراكات معلقة.
        </div>
      ) : !loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">معرف المستخدم</th>
                <th scope="col">الجنس</th>
                <th scope="col">نوع الاشتراك</th>
                <th scope="col">تاريخ البدء</th>
                <th scope="col">تاريخ الانتهاء</th>
                <th scope="col">الهدف</th>
                <th scope="col">الرسوم</th>
                <th scope="col">الحالة</th>
                <th scope="col">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub, index) => (
                <tr key={sub.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{sub.clientName}</td>
                  <td>{sub.gender}</td>
                  <td>{sub.plan.replace('_', ' ')}</td>
                  <td>{sub.requestDate}</td>
                  <td>{sub.endDate}</td>
                  <td>{sub.fitnessGoal}</td>
                  <td>${sub.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${sub.status === 'Pending' ? 'bg-warning text-dark' : 
                                             sub.status === 'Approved' ? 'bg-success' : 
                                             'bg-danger'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td>
                    {sub.status === 'Pending' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApprove(sub.id)}
                        >
                          <i className="fas fa-check me-1"></i> قبول
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(sub.id)}
                        >
                          <i className="fas fa-times me-1"></i> رفض
                        </button>
                      </>
                    )}
                    {sub.status !== 'Pending' && (
                      <span className="text-muted">تم معالجة الطلب</span>
                    )}
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
