import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../config';

const PendingCoaches = () => {
  // Pending coaches state
  const [pendingCoaches, setPendingCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch pending coaches from API
  const fetchPendingCoaches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Coaches/AllUnapprovedCoaches`);
      setPendingCoaches(response.data);
      setFilteredCoaches(response.data);
    } catch (error) {
      console.error('Error fetching pending coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPendingCoaches();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let result = [...pendingCoaches];

    // Apply specialty filter
    if (filters.specialty) {
      result = result.filter(coach => 
        coach.specialization?.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    // Apply experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      result = result.filter(coach => {
        const exp = coach.experience_Years || 0;
        return exp >= min && (!max || exp <= max);
      });
    }

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(coach => 
        (coach.fullName && coach.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (coach.specialization && coach.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCoaches(result);
  }, [searchTerm, filters, pendingCoaches]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Coaches/AdminApprovesCoach/${id}`);
      fetchPendingCoaches();
      setAlert({ show: true, type: 'success', message: 'Coach approved successfully' });
    } catch (error) {
      console.error(`Error approving coach ${id}:`, error);
      setAlert({ show: true, type: 'danger', message: 'Error approving coach' });
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/Coaches/RejectCoach/${id}`);
      fetchPendingCoaches();
      setAlert({ show: true, type: 'success', message: 'Coach rejected successfully' });
    } catch (error) {
      console.error(`Error rejecting coach ${id}:`, error);
      setAlert({ show: true, type: 'danger', message: 'Error rejecting coach' });
    }
  };

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
            <h4 className="fw-bold mb-0">Manage Pending Coaches</h4>
          </div>
          
          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select 
                value={filters.specialty} 
                onChange={(e) => handleFilterChange('specialty', e.target.value)} 
                className="form-select"
              >
                <option value="">All Specialties</option>
                <option value="Fitness">Fitness</option>
                <option value="Strength">Strength & Conditioning</option>
                <option value="Yoga">Yoga</option>
                <option value="CrossFit">CrossFit</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                value={filters.experience} 
                onChange={(e) => handleFilterChange('experience', e.target.value)} 
                className="form-select"
              >
                <option value="">All Experience Levels</option>
                <option value="1-3">1-3 Years</option>
                <option value="4-6">4-6 Years</option>
                <option value="7-10">7-10 Years</option>
                <option value="10-">10+ Years</option>
              </select>
            </div>
            <div className="col-md-6">
              <input 
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {loading && <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}
          {!loading && filteredCoaches.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No pending coach applications at the moment.
            </div>
          ) : !loading && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-start">Coach Name</th>
                    <th>Email</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Portfolio</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.map((coach, index) => (
                    <tr key={coach.userId} className="coach-row">
                      <td className="text-start">
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                          {coach.image ? (
                            <img 
                              src={`${API_BASE_IMAGE_URL}/images/profiles/${coach.image}`}
                              alt={coach.fullName}
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
                              <i className="fas fa-user-tie"></i>
                            </span>
                          )}
                          <span style={{ fontWeight: 600, fontSize: 16 }}>{coach.fullName}</span>
                        </span>
                      </td>
                      <td>{coach.email}</td>
                      <td>
                        <span className="badge bg-primary">
                          {coach.specialization}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {coach.experience_Years} years
                        </span>
                      </td>
                      <td>
                        {coach.portfolio_Link ? (
                          <a 
                            href={coach.portfolio_Link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-sm btn-outline-info"
                          >
                            <i className="fas fa-external-link-alt me-1"></i>
                            View
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">Pending</span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleApprove(coach.userId)}
                          >
                            <i className="fas fa-check me-1"></i>
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleReject(coach.userId)}
                          >
                            <i className="fas fa-times me-1"></i>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <style>{`
          .coach-row:hover { 
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
    </div>
  );
};

export default PendingCoaches;
