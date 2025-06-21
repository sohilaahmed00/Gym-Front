import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExerciseById } from '../../services/exerciseAPI'; // Import the API function
import styles from './ExerciseDetails.module.css';
import { API_BASE_IMAGE_URL } from '../../config';

function ExerciseDetails() {
  const { id } = useParams(); // Get the exercise ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = `${API_BASE_IMAGE_URL}t/images/Exercise/`; // Base URL for images

  useEffect(() => {
    const getExerciseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExerciseById(id); // Use the API call
        if (data) {
          setExercise(data);
        } else {
          setError('Exercise not found.');
        }
      } catch (err) {
        setError('Failed to load exercise details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getExerciseDetails();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading exercise details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!exercise) {
    return <div className={styles.notFound}>Exercise not found.</div>;
  }

  // Actual rendering with fetched data
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{exercise.exercise_Name}</h1>
        
        <div className={styles.imageContainer}>
          {exercise.image_gif && (
            <img 
              src={`${baseUrl}${exercise.image_gif}`}
              alt={`${exercise.exercise_Name} GIF`}
              className={styles.exerciseMedia}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=GIF+Not+Available'; }}
            />
          )}
          {!exercise.image_gif && exercise.image_url && (
             <img 
              src={`${baseUrl}${exercise.image_url}`}
              alt={`${exercise.exercise_Name} Image`}
              className={styles.exerciseMedia}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'; }}
            />
          )}
           {!exercise.image_gif && !exercise.image_url && (
              <div className={styles.noMediaPlaceholder}>No media available</div>
           )}
        </div>
        
        <div className={styles.detailsContent}>
          <p className={styles.description}><strong>Description:</strong> {exercise.description || 'No description available.'}</p>
          <p><strong>Target Muscle:</strong> {exercise.target_Muscle || 'N/A'}</p>
          <p><strong>Duration:</strong> {exercise.duration} seconds</p>
          <p><strong>Calories Burned:</strong> {exercise.calories_Burned} calories</p>
          {/* Add more details here as needed */}

          <button className={styles.backButton} onClick={() => navigate('/exercises')}>
            Back to Exercises
          </button>
        </div>
      </div>
    </>
  );
}

export default ExerciseDetails; 