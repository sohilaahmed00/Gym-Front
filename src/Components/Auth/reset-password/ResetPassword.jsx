import React, { useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ResetPassword.module.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const { email } = location.state || {};  // Retrieve email from state passed through navigate

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'New password is required',
        life: 3000,
      });
      return;
    }

    setLoading(true);

    const passwordData = {
      email,  // Send email and new password in the request
      newPassword,
    };

    try {           
      const response = await fetch('http://gymmatehealth.runasp.net/Auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),  
      });

      const data = await response.json(); 
        console.log(response);
        
      setLoading(false);

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Password Reset Successful',
          detail: 'Your password has been reset successfully!',
          life: 3000,
        });

        // Redirect to login page after successful reset
        navigate('/login');
      } else {
        if (data.errors && data.errors.NewPassword) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: data.errors.NewPassword[0], // Display specific password validation error
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: data.message || 'Failed to reset password',
            life: 3000,
          });
        }
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reset password, please try again',
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Reset Password</h2>
      <form onSubmit={handleResetPasswordSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            className={styles.formControl}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
