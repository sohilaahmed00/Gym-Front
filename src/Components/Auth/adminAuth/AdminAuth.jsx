import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import styles from './AdminLogin.module.css';
import { API_BASE_IMAGE_URL } from '../../../config';

// ✅ Replace jwt-decode with custom decode function
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    const loginData = { email, password };

    try {
      const response = await fetch(`${API_BASE_IMAGE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      setLoading(false);
      

      if (response.ok) {
        const decoded = decodeJWT(data.token);

        if (decoded?.roles?.[0] === 'Admin') {
          // Save admin info
          localStorage.setItem('token', data.token);
          localStorage.setItem('id', data.id);
          localStorage.setItem('fullName', data.fullName);

          toast.current.show({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Welcome, Admin!',
            life: 3000,
          });

          setTimeout(() => {
            navigate('/admin');
          }, 3000);
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You are not authorized as Admin',
            life: 3000,
          });
        }
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: data.message || 'Invalid email or password',
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to log in, please try again',
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Admin Login</h2>
      <form onSubmit={handleAdminLogin} className={styles.form}>
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
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-100 ${styles.formControl}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
