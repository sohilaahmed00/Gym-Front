import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CompleteProfile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';

const CompleteProfile = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bDate, setBDate] = useState('');
  const [gender, setGender] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [fitness_Goal, setFitness_Goal] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [portfolio_Link, setPortfolio_Link] = useState('');
  const [experience_Years, setExperience_Years] = useState('');
  const [availability, setAvailability] = useState('true');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id, userType } = location.state || {};

  // Validate the form based on userType
  const validateForm = () => {
    const newErrors = {};
    if (userType === 'User') {
      if (!height) newErrors.height = 'Height is required';
      if (!weight) newErrors.weight = 'Weight is required';
      if (!bDate) newErrors.bDate = 'Birth Date is required';
      if (!gender) newErrors.gender = 'Gender is required';
      if (!fitness_Goal) newErrors.fitness_Goal = 'Fitness Goal is required';
    } else {
      if (!specialization) newErrors.specialization = 'Specialization is required';
      if (!portfolio_Link) newErrors.portfolio_Link = 'Portfolio link is required';
      if (!experience_Years) newErrors.experience_Years = 'Experience is required';
      if (!bio) newErrors.bio = 'Bio is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) return;

    if (!id) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'User ID is missing', life: 3000 });
      return;
    }

    setLoading(true);
    const endpoint = userType === 'User' ? 'AddNewUser' : 'AddNewCoach';
    const bodyData =
      userType === 'User'
        ? { id, height, weight, bDate, gender, medicalConditions, allergies, fitness_Goal }
        : { id, specialization, portfolio_Link, experience_Years: Number(experience_Years), availability, bio };

    try {
      const response = await fetch(`http://gymmatehealth.runasp.net/Auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Store user information and navigate
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('fullName', data.fullName);
        localStorage.removeItem('step1Completed');
        localStorage.removeItem('step2Completed');
        localStorage.removeItem('step3Completed');

        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!', life: 3000 });
        setTimeout(() => navigate('/'), 3000);
      } else {
        // Handle validation errors
        if (data.errors) {
          Object.values(data.errors).forEach((errs) => {
            errs.forEach((err) => {
              toast.current.show({ severity: 'error', summary: 'Validation Error', detail: err, life: 3000 });
            });
          });
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: data.message || 'Failed to update profile', life: 3000 });
        }
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update profile', life: 3000 });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {userType === 'User' ? (
          <>
            <div className={styles.formGroup}>
              <label>Height</label>
              <input type="text" className={styles.formControl} value={height} onChange={(e) => setHeight(e.target.value)} />
              {errors.height && <p className={styles.errorText}>{errors.height}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Weight</label>
              <input type="text" className={styles.formControl} value={weight} onChange={(e) => setWeight(e.target.value)} />
              {errors.weight && <p className={styles.errorText}>{errors.weight}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Birth Date</label>
              <input type="date" className={styles.formControl} value={bDate} onChange={(e) => setBDate(e.target.value)} />
              {errors.bDate && <p className={styles.errorText}>{errors.bDate}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Gender</label>
              <div className={styles.radioGroup}>
                <label className={`${styles.radioLabel} ${gender === 'Male' ? styles.selected : ''}`}>
                  <input type="radio" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} className={styles.radioInput} />
                  <span className={styles.radioText}>Male</span>
                </label>
                <label className={`${styles.radioLabel} ${gender === 'Female' ? styles.selected : ''}`}>
                  <input type="radio" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} className={styles.radioInput} />
                  <span className={styles.radioText}>Female</span>
                </label>
              </div>
              {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Medical Conditions</label>
              <input type="text" className={styles.formControl} value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Allergies</label>
              <input type="text" className={styles.formControl} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Fitness Goal</label>
              <input type="text" className={styles.formControl} value={fitness_Goal} onChange={(e) => setFitness_Goal(e.target.value)} />
              {errors.fitness_Goal && <p className={styles.errorText}>{errors.fitness_Goal}</p>}
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label>Specialization</label>
              <input type="text" className={styles.formControl} value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
              {errors.specialization && <p className={styles.errorText}>{errors.specialization}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Portfolio Link</label>
              <input type="text" className={styles.formControl} value={portfolio_Link} onChange={(e) => setPortfolio_Link(e.target.value)} />
              {errors.portfolio_Link && <p className={styles.errorText}>{errors.portfolio_Link}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Experience (Years)</label>
              <input type="number" className={styles.formControl} value={experience_Years} onChange={(e) => setExperience_Years(e.target.value)} />
              {errors.experience_Years && <p className={styles.errorText}>{errors.experience_Years}</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea className={styles.formControl} value={bio} onChange={(e) => setBio(e.target.value)} rows="4" />
              {errors.bio && <p className={styles.errorText}>{errors.bio}</p>}
            </div>
          </>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
