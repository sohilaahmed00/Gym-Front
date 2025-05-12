import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './EnterOtp.module.css';

function EnterOtp() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = React.useRef(null);
  const navigate = useNavigate();
  
  const location = useLocation(); // Use useLocation to access state

  useEffect(() => {
    // Check if location.state exists and get email from it
    if (location.state && location.state.email) {
      setEmail(location.state.email); // Set the email from state
    } else {
      // Redirect to forgot password if state is not found
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'OTP is required',
        life: 3000,
      });
      return;
    }

    setLoading(true);

    const otpData = {
      email,
      otp,
    };
    console.log(otpData,"ot");
   
    
    try {           
      const response = await fetch('http://gymmatehealth.runasp.net/Auth/register-otp-for-new-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpData),
      });

      const data = await response.text();
        // console.log(data);
        console.log(response);
        
        
      setLoading(false);

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'OTP Verified',
          detail: 'OTP verified successfully, proceed to reset your password.',
          life: 3000,
        });

        // Navigate to the reset password page
        setTimeout(()=>{
            navigate('/reset-password', { state: { email } });
        },1000)
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: data.message || 'Invalid OTP',
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to verify OTP, please try again',
        life: 3000,
      });
    }
  };

  return (
    <div className={styles.otpContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Enter OTP</h2>
      <form onSubmit={handleOtpSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.formControl}
            value={email}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label>OTP</label>
          <input
            type="text"
            className={styles.formControl}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
}

export default EnterOtp;
