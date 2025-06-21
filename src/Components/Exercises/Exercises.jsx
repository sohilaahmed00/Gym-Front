import React, { useState, useEffect } from 'react';
import styles from './Exercises.module.css';
import { fetchCategories, fetchExercises } from '../../services/exerciseAPI';
import { Link } from 'react-router-dom';
import { API_BASE_IMAGE_URL } from '../../config';

export default function Exercises() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = `${API_BASE_IMAGE_URL}/images/Exercise/`;

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
    if (!selectedCategoryId) {
      setExercises(allExercises); 
    } else {
      const filtered = allExercises.filter(
        (e) => e.category_ID === selectedCategoryId
      );
      setExercises(filtered);
    }
  }, [selectedCategoryId, allExercises]);

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
