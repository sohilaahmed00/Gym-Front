import React, { useState } from 'react';
import './Register.css';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateBirthDate,
  validateGender,
  validateHeight,
  validateWeight,
  validateActivityLevel,
  validateGoal,
  validateTerms
} from './validation';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    diseases: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate immediately after change
    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'birthDate':
        error = validateBirthDate(value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      case 'height':
        error = validateHeight(value);
        break;
      case 'weight':
        error = validateWeight(value);
        break;
      case 'activityLevel':
        error = validateActivityLevel(value);
        break;
      case 'goal':
        error = validateGoal(value);
        break;
      case 'terms':
        error = validateTerms(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      phone: validatePhone(formData.phone),
      birthDate: validateBirthDate(formData.birthDate),
      gender: validateGender(formData.gender),
      height: validateHeight(formData.height),
      weight: validateWeight(formData.weight),
      activityLevel: validateActivityLevel(formData.activityLevel),
      goal: validateGoal(formData.goal),
      terms: validateTerms(formData.terms)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Here you would typically make an API call to register the user
        console.log('Form submitted successfully:', formData);
        alert('Registration successful');
        // Redirect to dashboard or show success message
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 register-form-container">
          <div className="register-header">
            <h2 className="text-center mb-4 register-title">Start Your Fitness Journey</h2>
            <p className="text-center register-subtitle">Sign up for free and transform your life</p>
          </div>

          <div className="d-grid gap-2 mb-3 social-buttons">
            <button className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-facebook me-2"></i> Sign up with Facebook
            </button>
            <button className="btn btn-outline-danger rounded-pill w-100 mb-6 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-google me-2"></i> Sign up with Google
            </button>
            <button className="btn btn-outline-info rounded-pill w-100 mb-6 d-flex align-items-center justify-content-center" type="button">
              <i className="fab fa-twitter me-2"></i> Sign up with Twitter
            </button>
          </div>

          <div className="text-center my-3 divider">OR</div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.fullName && touched.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
              />
              {errors.fullName && touched.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your phone number"
              />
              {errors.phone && touched.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">Date of Birth</label>
              <input
                type="date"
                className={`form-control ${errors.birthDate && touched.birthDate ? 'is-invalid' : ''}`}
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.birthDate && touched.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="gender-options">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="form-check-label" htmlFor="male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label className="form-check-label" htmlFor="female">Female</label>
                </div>
              </div>
              {errors.gender && touched.gender && <div className="invalid-feedback d-block">{errors.gender}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="height" className="form-label">Height (cm)</label>
              <input
                type="number"
                className={`form-control ${errors.height && touched.height ? 'is-invalid' : ''}`}
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your height"
              />
              {errors.height && touched.height && <div className="invalid-feedback">{errors.height}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="weight" className="form-label">Weight (kg)</label>
              <input
                type="number"
                className={`form-control ${errors.weight && touched.weight ? 'is-invalid' : ''}`}
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your weight"
              />
              {errors.weight && touched.weight && <div className="invalid-feedback">{errors.weight}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel" className="form-label">Activity Level</label>
              <select
                className={`form-select ${errors.activityLevel && touched.activityLevel ? 'is-invalid' : ''}`}
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.activityLevel && touched.activityLevel && <div className="invalid-feedback">{errors.activityLevel}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="goal" className="form-label">Goal</label>
              <select
                className={`form-select ${errors.goal && touched.goal ? 'is-invalid' : ''}`}
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select...</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="fitness">Fitness</option>
              </select>
              {errors.goal && touched.goal && <div className="invalid-feedback">{errors.goal}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="diseases" className="form-label">Chronic Diseases (Optional)</label>
              <input
                type="text"
                className="form-control"
                id="diseases"
                name="diseases"
                value={formData.diseases}
                onChange={handleChange}
                placeholder="Enter any health conditions"
              />
            </div>

            <div className="form-check mb-3">
              <input
                className={`form-check-input ${errors.terms && touched.terms ? 'is-invalid' : ''}`}
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label className="form-check-label" htmlFor="terms">
                I agree to the Terms & Conditions
              </label>
              {errors.terms && touched.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <a href="#">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
