import React, { useState, useEffect } from 'react';
import styles from './Coaches.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Coaches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: ''
  });
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://gymmatehealth.runasp.net/api/Coaches/GetAllCoaches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const transformedData = data.map(coach => ({
          id: coach.userId,
          name: coach.fullName,
          specialization: coach.specialization,
          bio: coach.bio,
          image: coach.image ? `http://gymmatehealth.runasp.net/images/${coach.image}` : '/placeholder-coach.jpg',
          rating: 0, 
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

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     coach.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (!filters.specialization || coach.specialization === filters.specialization);

    return matchesSearch && matchesFilters;
  });

  const handleSubscribe = (coachId) => {
    navigate('/subscribe', { state: { coachId } });
  };

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

      <div className={`${styles.searchSection} d-flex justify-content-center gap-5`}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a coach..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterOptions}>
          <div className={styles.filterGroup}>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={e => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            >
              <option value="">All Specializations</option>
              {[...new Set(coaches.map(c => c.specialization).filter(Boolean))].map(spec => (
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
                src={coach.image} 
                alt={coach.name} 
                className={styles.coachImage}
               
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
                <div className={styles.buttonsContainer}>
                  <Link to={`/coach/${coach.id}`} className={styles.viewProfileBtn}>
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSubscribe(coach.id)}
                    className={styles.subscribeBtn}
                  >
                    Subscribe
                  </button>
                </div>
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
