import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

import styles from './Login.module.css'; 
import { useCart } from '../../CartContext/CartContext';
import { API_BASE_IMAGE_URL } from '../../../config';

function Login() {

    const { updateUserInCartContext } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_IMAGE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'You have logged in successfully!',
          life: 3000,
        });

        // Save token and user data to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('fullName', data.fullName);
        updateUserInCartContext();
        setTimeout(()=>{
          navigate('/');
        },3000)
        
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

  const handleForgotPassword = () => {
    // Navigate to the forgot password page
    navigate('/forgot-password');
  };

  return (
    <div className={styles.loginContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLoginSubmit} className={styles.form}>
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
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            'Login'
          )}
        </button>
      </form>
      
      {/* Forgot Password Link */}
      <div className={styles.forgotPassword}>
        <span onClick={handleForgotPassword} className="text-primary" style={{ cursor: 'pointer' }}>
          Forgot Password?
        </span>
      </div>
      
    
      <div className={styles.registerLink}>
        <span>Don't have an account? <Link to="/register">Sign Up</Link></span>
      </div>
    </div>
  );
}

export default Login;
