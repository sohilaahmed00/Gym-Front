import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Mock API call function
  const fetchPendingSubscriptions = async (searchQuery = '') => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data
      const data = [
        { 
          id: 1, 
          clientName: 'John Smith', 
          email: 'john.smith@email.com',
          plan: 'Premium', 
          requestDate: '2024-03-15',
          amount: 1200.00,
          status: 'Pending Review'
        },
        { 
          id: 2, 
          clientName: 'Emma Wilson', 
          email: 'emma.wilson@email.com',
          plan: 'Basic', 
          requestDate: '2024-03-14',
          amount: 600.00,
          status: 'Pending Review'
        },
        { 
          id: 3, 
          clientName: 'Michael Brown', 
          email: 'michael.brown@email.com',
          plan: 'Premium', 
          requestDate: '2024-03-13',
          amount: 1200.00,
          status: 'Pending Review'
        }
      ];

      // Filter data based on search query
      const filteredData = searchQuery
        ? data.filter(subscription => 
            subscription.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subscription.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subscription.plan.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data;

      setPendingSubscriptions(filteredData);
      setFilteredSubscriptions(filteredData); // This should use filteredData from the mock API call
    } catch (error) {
      console.error('Error fetching pending subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPendingSubscriptions();
  }, []);

  // Handle search and filters - This effect should depend on pendingSubscriptions and filters, not call fetch again
  useEffect(() => {
    let result = [...pendingSubscriptions]; // Start with all fetched subscriptions

    // Apply plan filter
    if (filters.plan) {
      result = result.filter(subscription => subscription.plan === filters.plan);
    }
    // Apply request date filter
    if (filters.requestDate) {
      result = result.filter(subscription => subscription.requestDate === filters.requestDate);
    }
    // Apply search term filter (if searchTerm is not empty)
    if (searchTerm) {
        result = result.filter(subscription => 
            subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    setFilteredSubscriptions(result);
  }, [searchTerm, filters, pendingSubscriptions]); // Added searchTerm and pendingSubscriptions to dependencies

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Handle search term change directly without an extra effect
  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleApprove = (id) => {
    console.log(`Approve subscription ${id}`);
    // Add logic to approve subscription
  };

  const handleReject = (id) => {
    console.log(`Reject subscription ${id}`);
    // Add logic to reject subscription
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-orange fw-bold">⏳ Pending Subscriptions</h3>
        {/* Add any filters or search bar here if needed */}
      </div>
        {/* Example Search and Filter inputs - to be styled and integrated properly */}
        {/* <input 
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control mb-2"
        />
        <select value={filters.plan} onChange={(e) => handleFilterChange('plan', e.target.value)} className="form-select mb-2">
            <option value="">All Plans</option>
            <option value="Premium">Premium</option>
            <option value="Basic">Basic</option>
        </select>
        <input 
            type="date" 
            value={filters.requestDate} 
            onChange={(e) => handleFilterChange('requestDate', e.target.value)} 
            className="form-control mb-4"
        /> */}

      {loading && <p>Loading...</p>}
      {!loading && filteredSubscriptions.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No pending subscriptions found.
        </div>
      ) : !loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">User Name</th>
                <th scope="col">Plan Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub, index) => (
                <tr key={sub.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{sub.clientName}</td>
                  <td>{sub.plan}</td>
                  <td>{sub.requestDate}</td>
                  <td>${sub.amount ? sub.amount.toFixed(2) : 'N/A'}</td>
                  <td>
                    <span className={`badge bg-warning text-dark`}>{sub.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(sub.id)}
                    >
                      <i className="fas fa-check me-1"></i> Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(sub.id)}
                    >
                      <i className="fas fa-times me-1"></i> Reject
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
