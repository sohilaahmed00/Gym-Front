import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubscriberCalendar from './SubscriberCalendar';
import styles from './ProfileCard.module.css';

const API_BASE = 'http://gymmatehealth.runasp.net/api';

const SubscriberDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/Users/Getuserbyid/${id}`);
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
console.log(profile);

  return (
    <div className="container py-4">
      {/* Profile Card */}
      <div className={styles.profileCard}>
      <div className="row align-items-center">
        <div className="col-md-2 text-center">
          <img
            src={`http://gymmatehealth.runasp.net/images/profiles/${profile.image}`}
            alt={profile.fullName}
            className={styles.profileImg}
          />
        </div>
        <div className="col-md-10">
          <h3 className={styles.profileName}>{profile.fullName}</h3>
          <div className="row">
            <div className="col-md-6">
              <p>
                <span className={styles.infoIcon}>📧</span> <strong>Email:</strong>{' '}
                <span className={styles.valueBox}>{profile.email}</span>
              </p>
              <p>
                <span className={styles.infoIcon}>🚻</span> <strong>Gender:</strong>{' '}
                <span className={styles.valueBox}>{user.gender}</span>
              </p>
              <p>
                <span className={styles.infoIcon}>🎯</span> <strong>Goal:</strong>{' '}
                <span className={styles.valueBox}>{user.fitness_Goal}</span>
              </p>
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
