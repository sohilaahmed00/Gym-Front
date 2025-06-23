import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../config';

export default function ManageCoaches() {
  // Coaches state
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    experience: '',
    status: '',
    searchTerm: ''
  });

  // Fetch coaches data from API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/Coaches/GetAllCoaches`);
        if (!response.ok) {
          throw new Error('فشل في جلب بيانات المدربين');
        }
        const data = await response.json();
        setCoaches(data);
        setFilteredCoaches(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...coaches];

    // Apply specialization filter
    if (filters.specialization) {
      result = result.filter(coach => 
        coach.specialization?.toLowerCase() === filters.specialization.toLowerCase()
      );
    }

    // Apply experience filter
    if (filters.experience) {
      result = result.filter(coach => {
        const experience = coach.experience_Years;
        switch (filters.experience) {
          case '1-3':
            return experience >= 1 && experience <= 3;
          case '4-6':
            return experience >= 4 && experience <= 6;
          case '7+':
            return experience >= 7;
          default:
            return true;
        }
      });
    }

    // Apply status filter
    if (filters.status !== '') {
      const statusBool = filters.status === 'true';
      result = result.filter(coach => coach.isConfirmedByAdmin === statusBool);
    }

    // Apply search filter
    if (filters.searchTerm) {
      result = result.filter(coach =>
        coach.fullName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        coach.specialization?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredCoaches(result);
  }, [coaches, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get unique specializations from actual data
  const availableSpecializations = [...new Set(coaches.map(coach => coach.specialization).filter(Boolean))];

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  console.log(coaches);
  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Manage Coaches</h4>
          </div>

          {/* Filters Section */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
              >
                <option value="">All Specializations</option>
                {availableSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                <option value="">Experience Level</option>
                <option value="1-3">1-3 Years</option>
                <option value="4-6">4-6 Years</option>
                <option value="7+">7+ Years</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Approved</option>
                <option value="false">Not Approved</option>
              </select>
            </div>
            <div className="col-md-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search coaches..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-3">
            <small className="text-muted">
              Showing {filteredCoaches.length} of {coaches.length} coaches
            </small>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-start">Coach</th>
                  <th className="border-0">Specialization</th>
                  <th className="border-0">Experience (Years)</th>
                  <th className="border-0">Portfolio</th>
                  <th className="border-0">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoaches.map((coach) => (
                  <tr key={coach.userId} className="coach-row">
                    <td className="text-start">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                        {coach?.image ? (
                          <img 
                            src={`${API_BASE_IMAGE_URL}/images/profiles/${coach?.image}`} 
                            alt={coach?.fullName}
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
                            background: '#0d6efd22',
                            color: '#0d6efd',
                            fontSize: 20,
                            marginRight: 6,
                          }}>
                            <i className="fas fa-user-tie"></i>
                          </span>
                        )}
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{coach?.fullName}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {coach.specialization}
                      </span>
                    </td>
                    <td>{coach.experience_Years} Years</td>
                    <td>
                      {coach.portfolio_Link && (
                        <a href={coach.portfolio_Link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info">
                          <i className="fas fa-external-link-alt me-1"></i>
                          View
                        </a>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${coach.isConfirmedByAdmin ? 'bg-success' : 'bg-danger'} text-white`}>
                        {coach.isConfirmedByAdmin ? 'Approved' : 'Not Approved'}
                      </span>
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
          min-width: 90px;
          text-align: center;
          display: inline-block;
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