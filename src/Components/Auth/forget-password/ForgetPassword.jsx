import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css'; // Import the CSS module
import { API_BASE_IMAGE_URL } from '../../../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter your email',
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {                                 
      const response = await fetch(`${API_BASE_IMAGE_URL}/Auth/forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      console.log(response,"forgot");
      
      setLoading(false);

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Password Reset Email Sent',
          detail: 'Please check your email for instructions to reset your password.',
          life: 3000,
        });

        navigate('/enter-otp', { state: { email } });
        } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: data.message || 'Failed to send reset email',
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send password reset email, please try again.',
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Forgot Password</h2>
      <form onSubmit={handleForgotPasswordSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.formControl}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
