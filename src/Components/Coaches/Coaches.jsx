import React, { useState, useEffect } from 'react';
import styles from './Coaches.module.css';
import { Link } from 'react-router-dom';

function Coaches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: ''
  });
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaches data from API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://gymmatehealth.runasp.net/api/Coaches/GetAllCoaches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform the data to match our component's structure
        const transformedData = data.map(coach => ({
          id: coach.userId,
          name: coach.fullName,
          specialization: coach.specialization,
          bio: coach.bio,
          image: coach.image,
          rating: 0, // Default rating since it's not in the API
          experience: `${coach.experience_Years} years`,
          availability: coach.availability === "true"
        }));
        setCoaches(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === 'specialization' && value) {
      try {
        setLoading(true);
        const response = await fetch(`http://gymmatehealth.runasp.net/api/Coaches/GetCoachesByspecialization/${value}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const transformedData = data.map(coach => ({
          id: coach.userId,
          name: coach.fullName,
          specialization: coach.specialization,
          bio: coach.bio,
          image: coach.image,
          rating: 0,
          experience: `${coach.experience_Years} years`,
          availability: coach.availability === "true"
        }));
        setCoaches(transformedData);
      } catch (err) {
        console.error('Error fetching coaches by specialization:', err);
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    if (!coaches || coaches.length === 0) return [];
    const values = [...new Set(coaches.map(coach => coach[field]))];
    return values.filter(value => value); // Filter out null/undefined values
  };

  const specializations = getUniqueValues('specialization');

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (!filters.specialization || coach.specialization === filters.specialization);

    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading coaches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.coachesPage}>
      <div className={styles.pageTitle}>
        <h1>Our Coaches</h1>
        <p>Choose the perfect coach for you!</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a coach..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.filterOptions}>
          <div className={styles.filterGroup}>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.coachesGrid}>
        {filteredCoaches.length > 0 ? (
          filteredCoaches.map(coach => (
            <div key={coach.id} className={styles.coachCard}>
              <img 
                src={coach.image || '/placeholder-coach.jpg'} 
                alt={coach.name} 
                className={styles.coachImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-coach.jpg';
                }}
              />
              <div className={styles.coachInfo}>
                <h2 className={styles.coachName}>{coach.name}</h2>
                <p className={styles.coachSpecialization}>{coach.specialization}</p>
                <p className={styles.coachBio}>{coach.bio}</p>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={styles.star}>
                      {i < Math.floor(coach.rating || 0) ? '★' : '☆'}
                    </span>
                  ))}
                  <span>({coach.rating || 'N/A'})</span>
                </div>
                <Link to={`/coach/${coach.id}`} className={styles.viewProfileBtn}>
                  View Profile
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No coaches found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Coaches;