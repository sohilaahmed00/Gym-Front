import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import styles from './UserSettings.module.css';

export default function UserSettings() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);
  const navigate = useNavigate();

  // Get the user data from localStorage or backend
  useEffect(() => {
    const storedFullName = localStorage.getItem('fullName') || '';
    const storedEmail = localStorage.getItem('email') || '';
    setFullName(storedFullName);
    setEmail(storedEmail);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const userData = {
      fullName,
      email,
      password,
    };

    // Handle sending the updated data to the backend
    try {
      // Assuming you have an endpoint to handle updating user data
      const response = await fetch('http://your-api-endpoint.com/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Your information has been updated successfully!',
          life: 3000,
        });

        // Redirect to another page (like profile page or dashboard)
        navigate('/profile');
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: data.message || 'Failed to update information',
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update information, please try again',
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Update Your Information</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            className={styles.formControl}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.formControl}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            className={styles.formControl}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Updating...' : 'Update Info'}
        </button>
      </form>
    </div>
  );
}
