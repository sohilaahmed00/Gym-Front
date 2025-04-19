import React, { useState, useEffect } from 'react';
import styles from './Exercises.module.css';
import { fetchExercises, fetchBodyParts } from '../../services/exerciseAPI';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBodyParts = async () => {
      try {
        console.log('Starting to fetch body parts in component');
        setLoading(true);
        setError('');
        const parts = await fetchBodyParts();
        console.log('Received body parts:', parts);
        if (Array.isArray(parts) && parts.length > 0) {
          setBodyParts(parts);
          setSelectedBodyPart(parts[0]);
        } else {
          setError('No body parts data available');
        }
      } catch (err) {
        console.error('Component error fetching body parts:', err);
        setError('Failed to load body parts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getBodyParts();
  }, []);

  useEffect(() => {
    const getExercises = async () => {
      if (!selectedBodyPart) return;
      
      try {
        console.log('Starting to fetch exercises in component for:', selectedBodyPart);
        setLoading(true);
        setError('');
        const data = await fetchExercises(selectedBodyPart);
        console.log('Received exercises:', data);
        if (Array.isArray(data)) {
          setExercises(data.slice(0, 6));
        } else {
          setError('Invalid exercise data received');
        }
      } catch (err) {
        console.error('Component error fetching exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getExercises();
  }, [selectedBodyPart]);

  return (
    <div className={styles.exercisesPage}>
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold mb-3">Explore Exercises</h2>
              <p className="lead text-muted">
                Discover a wide range of exercises for different body parts and fitness levels
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center mb-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

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
                {bodyParts.map((part) => (
                  <button
                    key={part}
                    className={`btn ${
                      selectedBodyPart === part 
                      ? 'btn-orange' 
                      : 'btn-light hover-orange'
                    } text-capitalize`}
                    onClick={() => setSelectedBodyPart(part)}
                  >
                    {part}
                  </button>
                ))}
              </div>

              <div className="row g-4">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="col-lg-4 col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-img-top overflow-hidden" style={{ height: '250px' }}>
                        <img 
                          src={exercise.gifUrl} 
                          alt={exercise.name} 
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Exercise+Image';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title text-capitalize">{exercise.name}</h5>
                        <p className="card-text mb-2">
                          <span className="fw-medium">Equipment:</span> {exercise.equipment}
                        </p>
                        <p className="card-text">
                          <span className="fw-medium">Target:</span> {exercise.target}
                        </p>
                      </div>
                    </div>
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