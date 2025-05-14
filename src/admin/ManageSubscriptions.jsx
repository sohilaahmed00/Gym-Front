import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageSubscriptions() {
  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscriptions data from API (mock example)
  useEffect(() => {
    setSubscriptions([
      { 
        id: 1, 
        clientName: 'John Smith', 
        plan: 'Premium', 
        startDate: '2024-01-01', 
        endDate: '2024-12-31',
        status: 'Active',
        amount: 1200.00
      },
      { 
        id: 2, 
        clientName: 'Emma Wilson', 
        plan: 'Basic', 
        startDate: '2024-02-15', 
        endDate: '2024-08-15',
        status: 'Active',
        amount: 600.00
      },
      { 
        id: 3, 
        clientName: 'Michael Brown', 
        plan: 'Premium', 
        startDate: '2023-12-01', 
        endDate: '2024-05-31',
        status: 'Pending',
        amount: 1200.00
      }
    ]);
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Subscriptions Management</h4>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Add New Subscription
            </button>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Plans</option>
                <option value="premium">Premium</option>
                <option value="basic">Basic</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" placeholder="Start Date" />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" placeholder="End Date" />
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-start">Client</th>
                  <th className="border-0">Plan</th>
                  <th className="border-0">Start Date</th>
                  <th className="border-0">End Date</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Amount</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
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
                    <td>
                      <span className="badge bg-primary">
                        {subscription.plan}
                      </span>
                    </td>
                    <td>{subscription.startDate}</td>
                    <td>{subscription.endDate}</td>
                    <td>
                      <span className={`badge ${subscription.status === 'Active' ? 'bg-success' : 'bg-warning'} text-white`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold">${subscription.amount?.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash me-1"></i>
                          Delete
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
      `}</style>
    </div>
  );
} 