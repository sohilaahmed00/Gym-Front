import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubscriberCalendar from './SubscriberCalendar';
import styles from './ProfileCard.module.css';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../../config';


const SubscriberDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Users/Getuserbyid/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="container py-4">Loading user...</div>;
  if (error) return <div className="container py-4 text-danger">Error: {error}</div>;

  const profile = user?.applicationUser || {};
  console.log('USER DATA:', user);

  const inBodyUrl = user.inBody
    ? `${API_BASE_IMAGE_URL}/Images/Inbody/${user.inBody}`
    : null;

  return (
    <div className="container py-4">
      {/* Profile Card */}
      <div className={styles.profileCard}>
      <div className="row align-items-center">
        <div className="col-md-2 text-center">
          <img
            src={`${API_BASE_IMAGE_URL}/images/profiles/${profile.image}`}
            alt={profile.fullName}
            className={styles.profileImg}
          />
        </div>
        <div className="col-md-10">
          <h3 className={styles.profileName}>{profile.fullName}</h3>
          <div className="row">
            <div className="col-md-6">
              <p>
                <span className={styles.infoIcon}>🚻</span> <strong>Gender:</strong>{' '}
                <span className={styles.valueBox}>{user.gender}</span>
              </p>
              <p>
                <span className={styles.infoIcon}>🎯</span> <strong>Goal:</strong>{' '}
                <span className={styles.valueBox}>{user.fitness_Goal}</span>
              </p>
              {/* Inbody File Display */}
              {inBodyUrl && (
                <div
                  style={{
                    marginTop: 8,
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 2px 8px #ff57221a",
                    border: "1.5px solid #ffb184",
                    minHeight: 40,
                    marginBottom: 8,
                    maxWidth: 300,
                  }}
                >
                  <span style={{ fontSize: 18, color: "#FF5722", fontWeight: 700, display: "flex", alignItems: "center" }}>
                    <i className="fas fa-file-pdf" style={{ marginRight: 5, fontSize: 18 }}></i>
                    Inbody File
                  </span>
                  <a
                    href={inBodyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      marginLeft: 8,
                      transition: "color 0.2s",
                    }}
                    onMouseOver={e => (e.target.style.color = "#d32f2f")}
                    onMouseOut={e => (e.target.style.color = "#1976d2")}
                  >
                    <i className="fas fa-file-pdf" style={{ color: "#1976d2", fontSize: 14 }}></i>
                    View Inbody File
                  </a>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <p>
                <span className={styles.infoIcon}>📏</span> <strong>Height:</strong>{' '}
                <span className={styles.valueBox}>{user.height} cm</span>
              </p>
              <p>
                <span className={styles.infoIcon}>⚖️</span> <strong>Weight:</strong>{' '}
                <span className={styles.valueBox}>{user.weight} kg</span>
              </p>
              <p>
                <span className={styles.infoIcon}>🧬</span> <strong>Medical:</strong>{' '}
                <span className={styles.valueBox}>{user.medicalConditions || 'None'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  

      {/* Calendar */}
      <h4 className="fw-bold mb-3">📅 Weekly Fitness Plan</h4>
      <SubscriberCalendar userId={id} userName={user?.applicationUser.fullName} />
    </div>
  );
};

export default SubscriberDetails;
