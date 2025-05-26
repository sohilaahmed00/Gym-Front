import React, { useState } from 'react';
import './Login.css';
import {
  validateEmail,
  validatePassword
} from './validation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Here you would typically make an API call to login
        const response = await fetch('YOUR_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        console.log('Login successful:', data);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect to dashboard or show success message
        // window.location.href = '/dashboard';
      } catch (error) {
        console.error('Login failed:', error);
        setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 login-form-container">
          <div className="login-header">
            <h2 className="text-center mb-4 login-title">Welcome Back</h2>
            <p className="text-center login-subtitle">Sign in to continue your fitness journey</p>
          </div>

          <div className="d-grid gap-2 mb-3 social-buttons">
            <button className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-facebook me-2"></i> Sign in with Facebook
            </button>
            <button className="btn btn-outline-danger rounded-pill w-100 mb-6 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-google me-2"></i> Sign in with Google
            </button>
            <button className="btn btn-outline-info rounded-pill w-100 mb-6 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-twitter me-2"></i> Sign in with Twitter
            </button>
          </div>

          <div className="text-center my-3 divider">OR</div>

          <form className="login-form" onSubmit={handleSubmit}>
            {loginError && (
              <div className="alert alert-danger" role="alert">
                {loginError}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
              />
              {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="form-group d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account? <a href="/register">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
