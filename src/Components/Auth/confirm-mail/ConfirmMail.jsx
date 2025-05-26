import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate, useLocation } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { SaveRegistrationProgress } from '../../../services/checkRegisterationStep';
import styles from './ConfirmMail.module.css'
import { Spinner } from 'react-bootstrap';

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const ConfirmMail = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); 
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');  // New state to hold role
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);
  const navigate = useNavigate();
  
  const location = useLocation(); 
  const { email: initialEmail, userType  } = location.state || {}; 

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail); 
    }
  }, [initialEmail]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!otp) newErrors.otp = 'OTP is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value); 
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!email) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email is required', life: 3000 });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://gymmatehealth.runasp.net/Auth/confirm-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }), 
      });

      const data = await response.json();

      if (response.ok) {
        
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Email confirmed successfully! Please complete your profile', life: 3000 });
        
        const userId = data.id; 
        setUserId(userId);
        SaveRegistrationProgress(2);
    
        setTimeout(() => {
          // Send both id and role to the next page
          navigate('/complete-profile', { state: { id: userId, userType: userType } }); 
        }, 3000); 
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: data.message || 'Invalid OTP', life: 3000 });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to confirm email', life: 3000 });
    }
  };

  return (
    <div className={styles.confirmContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Confirm Email</h2>
      <form onSubmit={handleOtpSubmit} className={styles.confirmForm}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input 
            type="email" 
            className={styles.formControl} 
            value={email} 
            onChange={handleEmailChange} 
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Enter OTP</label>
          <input 
            type="text" 
            className={styles.formControl} 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          {errors.otp && <p className={styles.errorText}>{errors.otp}</p>}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default ConfirmMail;
