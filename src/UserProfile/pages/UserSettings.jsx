import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import styles from './UserSettings.module.css';
import { API_BASE_URL } from '../../config';

export default function UserSettings() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    height: '',
    weight: '',
    bDate: '',
    gender: '',
    medicalConditions: '',
    allergies: '',
    fitness_Goal: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inbodyFile, setInbodyFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Users/Getuserbyid/${userId}`);
        const data = await response.json();

        setFormData({
          fullName: data.applicationUser.fullName || '',
          email: data.applicationUser.email || '',
          height: data.height || '',
          weight: data.weight || '',
          bDate: data.bDate ? data.bDate.slice(0, 10) : '',
          gender: data.gender || '',
          medicalConditions: data.medicalConditions || '',
          allergies: data.allergies || '',
          fitness_Goal: data.fitness_Goal || '',
        });
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load user data' });
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.current.show({ severity: 'warn', summary: 'Invalid file', detail: 'Only PDF or image files are allowed' });
        e.target.value = null;
        setInbodyFile(null);
        return;
      }
      setInbodyFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (inbodyFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('height', parseFloat(formData.height));
        formDataToSend.append('weight', parseFloat(formData.weight));
        formDataToSend.append('bDate', formData.bDate);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('medicalConditions', formData.medicalConditions);
        formDataToSend.append('allergies', formData.allergies);
        formDataToSend.append('fitness_Goal', formData.fitness_Goal);
        formDataToSend.append('inbody', inbodyFile);

        response = await fetch(`${API_BASE_URL}/Users/UpdateUser/${userId}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/Users/UpdateUser/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            bDate: formData.bDate,
            gender: formData.gender,
            medicalConditions: formData.medicalConditions,
            allergies: formData.allergies,
            fitness_Goal: formData.fitness_Goal,
          }),
        });
      }
      setLoading(false);
      console.log(response);
      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Profile updated successfully' });
        // navigate('/user');
      } else {
        const data = await response.json();
        toast.current.show({ severity: 'error', summary: 'Error', detail: data.message || 'Failed to update' });
      }
    } catch {
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Update failed, try again later' });
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Edit Your Profile</h2>
    <form onSubmit={handleSubmit} className={styles.form}>
      {[
        { label: 'Full Name', name: 'fullName', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Height (cm)', name: 'height', type: 'number' },
        { label: 'Weight (kg)', name: 'weight', type: 'number' },
        { label: 'Birth Date', name: 'bDate', type: 'date' },
        { label: 'Gender', name: 'gender', type: 'text' },
        { label: 'Medical Conditions', name: 'medicalConditions', type: 'text' },
        { label: 'Allergies', name: 'allergies', type: 'text' },
        { label: 'Fitness Goal', name: 'fitness_Goal', type: 'text' },
      ].map(({ label, name, type }) => (
        <div className={styles.formGroup} key={name}>
          <label>{label}</label>
         <div className={styles.inputWrapper}>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={styles.formControl}
            disabled={name === 'fullName' || name === 'email'}
          />
          {(name === 'fullName' || name === 'email') && (
            <span className={styles.tooltip}>This field can't be updated</span>
          )}
        </div>
          {errors[name] && <p className={styles.errorText}>{errors[name]}</p>}
        </div>
      ))}
      <div className={styles.formGroup}>
        <label>Inbody (Image or PDF)</label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className={styles.formControl}
        />
        {inbodyFile && (
          <p style={{ fontSize: '0.9em', color: '#555' }}>Selected file: {inbodyFile.name}</p>
        )}
      </div>
      <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
    </form>

    </div>
  );
}
