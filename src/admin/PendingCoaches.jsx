import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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

  // Fetch pending coaches from API
  const fetchPendingCoaches = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://gymmatehealth.runasp.net/api/Coaches/AllUnapprovedCoaches');
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
      await axios.put(`http://gymmatehealth.runasp.net/api/Coaches/AdminApprovesCoach/${id}`);
      fetchPendingCoaches();
    } catch (error) {
      console.error(`Error approving coach ${id}:`, error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://gymmatehealth.runasp.net/api/Coaches/RejectCoach/${id}`);
      fetchPendingCoaches();
    } catch (error) {
      console.error(`Error rejecting coach ${id}:`, error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-orange fw-bold">Manage Pending Coach </h3>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <input 
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
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
        <div className="col-md-4">
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
      </div>

      {loading && <p>Loading...</p>}
      {!loading && filteredCoaches.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No pending coach applications at the moment.
        </div>
      ) : !loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Coach Name</th>
                <th scope="col">Email</th>
                <th scope="col">Specialty</th>
                <th scope="col">Experience (Years)</th>
                <th scope="col">Portfolio</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach, index) => (
                <tr key={coach.userId}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <div className="d-flex align-items-center">
                      {coach.image ? (
                        <img 
                          src={`http://gymmatehealth.runasp.net/images/profiles/${coach.image}`}
                          alt={coach.fullName}
                          className="rounded-circle me-2"
                          width="32"
                          height="32"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="avatar-placeholder me-2">
                          <i className="fas fa-user-tie"></i>
                        </div>
                      )}
                      <span>{coach.fullName}</span>
                    </div>
                  </td>
                  <td>{coach.email}</td>
                  <td>
                    <span className="badge bg-primary">
                      {coach.specialization}
                    </span>
                  </td>
                  <td>{coach.experience_Years} years</td>
                  <td>
                    {coach.portfolio_Link && (
                      <a 
                        href={coach.portfolio_Link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-outline-info"
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        View
                      </a>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">Pending</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(coach.userId)}
                    >
                      <i className="fas fa-check me-1"></i> Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(coach.userId)}
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

      <style>{`
        .avatar-placeholder {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
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
};

export default PendingCoaches;
