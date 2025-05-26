import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CoachProfile.module.css';

function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://gymmatehealth.runasp.net/api/Coaches/GetCoachbyId/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCoach(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching coach profile:', err);
        setError('Failed to load coach profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachProfile();
  }, [id]);

  const handleSubscribe = () => {
    navigate('/subscribe', { state: { coachId: id } });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading coach profile...</p>
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

  if (!coach) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Coach not found</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/coaches')}
        >
          Back to Coaches
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/coaches')}
        >
          ← Back to Coaches
        </button>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileImage}>
          <img 
            src={`http://gymmatehealth.runasp.net/images/profiles/${coach.applicationUser?.image}` || '/placeholder-coach.jpg'} 
            alt={coach.applicationUser?.fullName}
          />
        </div>

        <div className={styles.profileInfo}>
          <h1>{coach.applicationUser?.fullName}</h1>
          <div className={styles.specialization}>
            <span>{coach.specialization}</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{coach.experience_Years}</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
          </div>

          <div className={styles.bio}>
            <h2>About Me</h2>
            <p>{coach.bio}</p>
          </div>

          <div className={styles.contactSection}>
            <h2>Contact Information</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <span>{coach.applicationUser?.email || 'Not provided'}</span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-globe"></i>
                <span>{coach.portfolio_Link || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <button 
            className={styles.bookButton}
            onClick={handleSubscribe}
            
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoachProfile;