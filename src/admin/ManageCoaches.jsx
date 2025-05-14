import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageCoaches() {
  // Coaches state
  const [coaches, setCoaches] = useState([]);

  // Fetch coaches data from API (mock example)
  useEffect(() => {
    setCoaches([
      { 
        id: 1, 
        name: 'Ahmed Ali', 
        specialty: 'Fitness', 
        experience: '5 years',
        rating: 4.8,
        status: 'Active'
      },
      { 
        id: 2, 
        name: 'Sarah Johnson', 
        specialty: 'Yoga', 
        experience: '3 years',
        rating: 4.9,
        status: 'Active'
      },
      { 
        id: 3, 
        name: 'David Wilson', 
        specialty: 'CrossFit', 
        experience: '7 years',
        rating: 4.7,
        status: 'Active'
      }
    ]);
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Coaches Management</h4>
            <button className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Add New Coach
            </button>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Specialties</option>
                <option value="fitness">Fitness</option>
                <option value="yoga">Yoga</option>
                <option value="crossfit">CrossFit</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Experience Level</option>
                <option value="1-3">1-3 years</option>
                <option value="4-6">4-6 years</option>
                <option value="7+">7+ years</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Search coaches..." />
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-start">Coach</th>
                  <th className="border-0">Specialty</th>
                  <th className="border-0">Experience</th>
                  <th className="border-0">Rating</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((coach) => (
                  <tr key={coach.id} className="coach-row">
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
                          <i className="fas fa-user-tie"></i>
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{coach.name}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {coach.specialty}
                      </span>
                    </td>
                    <td>{coach.experience}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        <i className="fas fa-star me-1"></i>
                        {coach.rating}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${coach.status === 'Active' ? 'bg-success' : 'bg-danger'} text-white`}>
                        {coach.status}
                      </span>
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
        .coach-row:hover { 
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