import React, { useState, useEffect } from 'react';
import styles from './Exercises.module.css';
import { fetchCategories, fetchExercises } from '../../services/exerciseAPI';
import { Link } from 'react-router-dom';

export default function Exercises() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const baseUrl = 'http://gymmatehealth.runasp.net/images/Exercise/';

  useEffect(() => {
    setLoading(true);
    setError('');
  
    fetchCategories()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
          setSelectedCategoryId();
        } else {
          throw new Error('No categories found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load categories');
      });
  
    fetchExercises()
      .then((exs) => {
        if (Array.isArray(exs)) {
          setAllExercises(exs);
          setExercises(exs); 
        } else {
          throw new Error('Invalid exercises data');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load exercises');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  useEffect(() => {
    let filtered = allExercises;
    if (selectedCategoryId) {
      filtered = filtered.filter(e => e.category_ID === selectedCategoryId);
    }
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(e =>
        e.exercise_Name && e.exercise_Name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    setExercises(filtered);
  }, [selectedCategoryId, allExercises]);

  function handleSearch() {
    let filtered = allExercises;
    if (selectedCategoryId) {
      filtered = filtered.filter(e => e.category_ID === selectedCategoryId);
    }
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(e =>
        e.exercise_Name && e.exercise_Name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    setExercises(filtered);
  }

  function handleClearSearch() {
    setSearchTerm('');
    // Reset exercises to category filter only
    if (selectedCategoryId) {
      setExercises(allExercises.filter(e => e.category_ID === selectedCategoryId));
    } else {
      setExercises(allExercises);
    }
  }

  return (
    <div className={styles.exercisesPage}>
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold mb-3">Explore Exercises</h2>
              <p className="lead text-muted">
                Discover a wide range of exercises for different body parts and fitness levels.
              </p>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="text-center mb-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger text-center mb-4" role="alert">
              {error}
              <button
                className="btn btn-outline-danger ms-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                <button
                  className={`btn ${
                    !selectedCategoryId ? 'btn-orange' : 'btn-light hover-orange'
                  } text-capitalize`}
                  onClick={() => setSelectedCategoryId(null)} 
                >
                  All Exercises
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.category_ID}
                    className={`btn ${
                      selectedCategoryId === cat.category_ID
                        ? 'btn-orange'
                        : 'btn-light hover-orange'
                    } text-capitalize`}
                    onClick={() => setSelectedCategoryId(cat.category_ID)}
                  >
                    {cat.category_Name}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="d-flex justify-content-center align-items-center mb-4 gap-2" style={{gap: 12}}>
                <input
                  type="text"
                  className="form-control"
                  style={{ maxWidth: 300, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px solid #FF5722' }}
                  placeholder="Search exercise by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                />
                <button
                  className="btn"
                  style={{ background: '#FF5722', color: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(255,87,34,0.10)', fontWeight: 600, padding: '8px 22px', border: 'none', transition: 'background 0.2s' }}
                  onClick={handleSearch}
                  onMouseOver={e => e.currentTarget.style.background = '#f4511e'}
                  onMouseOut={e => e.currentTarget.style.background = '#FF5722'}
                >
                  Search
                </button>
                <button
                  className="btn"
                  style={{ background: '#fff', color: '#FF5722', border: '1.5px solid #FF5722', borderRadius: 8, fontWeight: 600, padding: '8px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'color 0.2s, border 0.2s' }}
                  onClick={handleClearSearch}
                  disabled={!searchTerm}
                  onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#FF5722'; }}
                  onMouseOut={e => { e.currentTarget.style.color = '#FF5722'; e.currentTarget.style.background = '#fff'; }}
                >
                  Clear
                </button>
              </div>

              {/* Exercises Cards */}
              <div className="row g-4">
                {exercises.map((exercise) => (
                  <div key={exercise.exercise_ID} className="col-lg-3 col-md-6">
                    <Link to={`/exercise/${exercise.exercise_ID}`} className="card h-100 shadow-sm" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="card-img-top overflow-hidden" style={{ height: '250px' }}>
                        <img
                          src={
                            exercise.image_gif
                              ? `${baseUrl}${exercise.image_gif}`
                              : `${baseUrl}${exercise.image_url}`
                          }
                          alt={exercise.exercise_Name}
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title text-capitalize mb-4">
                          {exercise.exercise_Name}
                        </h5>
                        <p className="card-text mb-2 d-flex justify-content-between">
                          <span className="fw-medium">Target:</span>{' '}
                          {exercise.target_Muscle}
                        </p>
                        <p className="card-text d-flex justify-content-between">
                          <span className="fw-medium">Duration:</span>{' '}
                          {exercise.duration} seconds
                        </p>

                        
                        <span className={styles.badge}>
                          {exercise.calories_Burned} Calories Burned
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
