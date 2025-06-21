import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';      
import 'primereact/resources/primereact.min.css';              
import 'primeicons/primeicons.css';                           
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../../config';


export default function ExerciseDropdown({ onSelect }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Exercises/GetAllExercises`);
        setExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };
    fetchExercises();
  }, []);

  const selectedExerciseTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.exercise_Name}
            src={`${API_BASE_IMAGE_URL}/images/Exercise/${option.image_gif}`}
            style={{ width: 40, height: 30, objectFit: 'cover', marginRight: 8 }}
          />
          <div>{option.exercise_Name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const exerciseOptionTemplate = (option) => {
    if (!option) return null;
    return (
      <div className="flex align-items-center" style={{ gap: '8px' }}>
        <img
          alt={option.exercise_Name}
          src={`${API_BASE_IMAGE_URL}/images/Exercise/${option.image_gif}`}
          style={{ width: 40, height: 30, objectFit: 'cover' }}
        />
        <div>{option.exercise_Name}</div>
      </div>
    );
  };

  const onChange = (e) => {
    setSelectedExercise(e.value);
    if (onSelect) onSelect(e.value);
  };

  return (
    <Dropdown
      value={selectedExercise}
      options={exercises}
      onChange={onChange}
      optionLabel="exercise_Name"
      placeholder="Select Exercise"
      filter
      showClear
      valueTemplate={selectedExerciseTemplate}
      itemTemplate={exerciseOptionTemplate}
      filterBy="exercise_Name"
      style={{ width: '100%' }}
    />
  );
}
