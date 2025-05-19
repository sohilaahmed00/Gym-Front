import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PendingCoaches = () => {
  // Pending coaches state
  const [pendingCoaches, setPendingCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    // Define filters relevant to coaches if any, e.g., experience, specialty
    specialty: '',
    requestDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock API call function
  const fetchPendingCoaches = async (searchQuery = '') => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data for pending coaches
      const data = [
        { 
          id: 1, 
          coachName: 'Ali Hassan', 
          email: 'ali.hassan@email.com',
          specialty: 'Weight Lifting', 
          experienceYears: 5,
          requestDate: '2024-07-25',
          status: 'Pending Review'
        },
        { 
          id: 2, 
          coachName: 'Sara Ibrahim', 
          email: 'sara.ibrahim@email.com',
          specialty: 'Yoga & Pilates', 
          experienceYears: 3,
          requestDate: '2024-07-26',
          status: 'Pending Review'
        },
        { 
          id: 3, 
          coachName: 'Khaled Ahmed', 
          email: 'khaled.ahmed@email.com',
          specialty: 'Cardio & Endurance', 
          experienceYears: 7,
          requestDate: '2024-07-22',
          status: 'Pending Review'
        }
      ];

      // Filter data based on search query
      const filteredData = searchQuery
        ? data.filter(coach => 
            coach.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coach.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coach.specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data;

      setPendingCoaches(filteredData);
      setFilteredCoaches(filteredData);
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

    // Apply filters
    if (filters.specialty) {
      result = result.filter(coach => coach.specialty.toLowerCase().includes(filters.specialty.toLowerCase()));
    }
    if (filters.requestDate) {
      result = result.filter(coach => coach.requestDate === filters.requestDate);
    }

    setFilteredCoaches(result);
  }, [filters, pendingCoaches]);

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPendingCoaches(searchTerm);
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

  const handleApprove = (id) => {
    console.log(`Approve coach application ${id}`);
    // Add logic to approve coach application
  };

  const handleReject = (id) => {
    console.log(`Reject coach application ${id}`);
    // Add logic to reject coach application
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-orange fw-bold">🧑‍🏫 Pending Coach Applications</h3>
        {/* Add any filters or search bar here if needed */}
      </div>

      {loading && <p>Loading...</p> } 
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
                
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach, index) => (
                <tr key={coach.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{coach.coachName}</td>
                  <td>{coach.email}</td>
                  <td>{coach.specialty}</td>
                  <td>{coach.experienceYears}</td>
                 
                  <td>
                    <span className={`badge bg-warning text-dark`}>{coach.status}</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(coach.id)}
                    >
                      <i className="fas fa-check me-1"></i> Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(coach.id)}
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

export default PendingCoaches;
