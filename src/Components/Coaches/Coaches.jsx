import React, { useState } from 'react';
import styles from './Coaches.module.css';
import { Link } from 'react-router-dom';

function Coaches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    language: '',
    location: ''
  });

  const coaches = [
    {
      id: 1,
      name: "Ahmed Said",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer with 5 years of experience in personal training. Specialized in strength and endurance training.",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai"
    },
    {
      id: 2,
      name: "Sarah Mohamed",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist with 3 years of experience in meal planning and client coaching.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "Arabic",
      location: "Abu Dhabi"
    },
    {
      id: 3,
      name: "Mohamed Ali",
      specialization: "Sports Coach",
      bio: "Professional sports coach with 7 years of experience in team sports and professional athletes training.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai"
    },
    {
      id: 4,
      name: "Layla Ahmed",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer specialized in women's training with 4 years of experience in fitness.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Abu Dhabi"
    },
    {
      id: 5,
      name: "John Smith",
      specialization: "Sports Coach",
      bio: "International sports coach with 10 years of experience in elite athlete training.",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "English",
      location: "Dubai"
    },
    {
      id: 6,
      name: "Nora Khalid",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist specialized in sports nutrition with 6 years of experience.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "Arabic",
      location: "Abu Dhabi"
    },
    {
      id: 7,
      name: "Ali Hassan",
      specialization: "Fitness Trainer",
      bio: "Certified fitness trainer specialized in senior training with 8 years of experience.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      language: "Arabic",
      location: "Dubai"
    },
    {
      id: 8,
      name: "Emily Wilson",
      specialization: "Nutrition Coach",
      bio: "Certified nutritionist specialized in therapeutic nutrition with 5 years of experience.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      language: "English",
      location: "Abu Dhabi"
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (!filters.specialization || coach.specialization === filters.specialization) &&
                          (!filters.language || coach.language === filters.language) &&
                          (!filters.location || coach.location === filters.location);

    return matchesSearch && matchesFilters;
  });

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
              <option value="Fitness Trainer">Fitness Trainer</option>
              <option value="Nutrition Coach">Nutrition Coach</option>
              <option value="Sports Coach">Sports Coach</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
            >
              <option value="">All Languages</option>
              <option value="Arabic">Arabic</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.coachesGrid}>
        {filteredCoaches.map(coach => (
          <div key={coach.id} className={styles.coachCard}>
            <img src={coach.image} alt={coach.name} className={styles.coachImage} />
            <div className={styles.coachInfo}>
              <h2 className={styles.coachName}>{coach.name}</h2>
              <p className={styles.coachSpecialization}>{coach.specialization}</p>
              <p className={styles.coachBio}>{coach.bio}</p>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.star}>
                    {i < Math.floor(coach.rating) ? '★' : '☆'}
                  </span>
                ))}
                <span>({coach.rating})</span>
              </div>
              <Link to={`/coach/${coach.id}`} className={styles.viewProfileBtn}>
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coaches; 