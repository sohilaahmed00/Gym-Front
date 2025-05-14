import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManagePendingSubscriptions() {
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
      setFilteredSubscriptions(filteredData);
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

  // Handle search and filters
  useEffect(() => {
    let result = [...pendingSubscriptions];

    // Apply filters
    if (filters.plan) {
      result = result.filter(subscription => subscription.plan === filters.plan);
    }
    if (filters.requestDate) {
      result = result.filter(subscription => subscription.requestDate === filters.requestDate);
    }

    setFilteredSubscriptions(result);
  }, [filters, pendingSubscriptions]);

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPendingSubscriptions(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Pending Subscriptions</h4>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <select 
                className="form-select"
                value={filters.plan}
                onChange={(e) => handleFilterChange('plan', e.target.value)}
              >
                <option value="">All Plans</option>
                <option value="Premium">Premium</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
            <div className="col-md-4">
              <input 
                type="date" 
                className="form-control" 
                placeholder="Request Date"
                value={filters.requestDate}
                onChange={(e) => handleFilterChange('requestDate', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search pending subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-start">Client</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Plan</th>
                  <th className="border-0">Request Date</th>
                  <th className="border-0">Amount</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading pending subscriptions...
                      </div>
                    </td>
                  </tr>
                ) : filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No pending subscriptions found
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="subscription-row">
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
                            background: '#0d6efd22',
                            color: '#0d6efd',
                            fontSize: 20,
                            marginRight: 6,
                          }}>
                            <i className="fas fa-user"></i>
                          </span>
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{subscription.clientName}</span>
                        </span>
                      </td>
                      <td>{subscription.email}</td>
                      <td>
                        <span className="badge bg-primary">
                          {subscription.plan}
                        </span>
                      </td>
                      <td>{subscription.requestDate}</td>
                      <td>
                        <span className="fw-bold">${subscription.amount?.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {subscription.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-success">
                            <i className="fas fa-check me-1"></i>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-times me-1"></i>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
        .input-group-text {
          border-radius: 8px 0 0 8px;
          border-right: none;
        }
        .input-group .form-control {
          border-radius: 0 8px 8px 0;
          border-left: none;
        }
        .input-group .form-control:focus {
          border-left: none;
          box-shadow: none;
        }
        .input-group .form-control:focus + .input-group-text {
          border-color: #0d6efd;
        }
      `}</style>
    </div>
  );
} 