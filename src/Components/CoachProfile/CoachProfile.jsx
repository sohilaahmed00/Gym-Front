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
      <button 
        className={styles.backButton}
        onClick={() => navigate('/coaches')}
      >
        ← Back to Coaches
      </button>

      <div className={styles.profileContainer}>
        {/* Right Column for Image (now on the left) */}
        <div className={styles.rightColumn}>
          <img 
            src={`http://gymmatehealth.runasp.net/images/profiles/${coach.applicationUser?.image}` || '/placeholder-coach.jpg'} 
            alt={coach.applicationUser?.fullName}
            className={styles.coachImage}
          />
          <button 
            className={styles.subscribeButton}
            onClick={handleSubscribe}
          >
            Subscribe Now
          </button>
        </div>

        {/* Left Column for Information (now on the right) */}
        <div className={styles.leftColumn}>
          <h1 className={styles.coachName}>{coach.applicationUser?.fullName}</h1>
          <p className={styles.coachSpecialization}>{coach.specialization}</p>

          <h2 className={styles.sectionTitle}>About Me</h2>
          <p className={styles.bioText}>{coach.bio}</p>

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{coach.experience_Years}</div>
              <div className={styles.statLabel}>Years Experience</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Certified</div>
              <div className={styles.statLabel}>Coach</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Online</div>
              <div className={styles.statLabel}>Coaching</div>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Portfolio</h2>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <i className="fas fa-globe"></i>
              {coach.portfolio_Link ? (
                <a href={coach.portfolio_Link} target="_blank" rel="noopener noreferrer" className={styles.portfolioLink}>
                  {coach.portfolio_Link}
                </a>
              ) : (
                <span>Not provided</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachProfile;