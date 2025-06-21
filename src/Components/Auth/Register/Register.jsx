import React, { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap'; 
import { CheckRegistrationProgress, SaveRegistrationProgress } from '../../../services/checkRegisterationStep';
import styles from './Register.module.css'
import { API_BASE_IMAGE_URL } from '../../../config';
const Register = () => {
  const [userType, setUserType] = useState('User');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const toast = React.useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const step = CheckRegistrationProgress();
    if (step === 'step2') {
      navigate('/confirm-mail'); 
    } else if (step === 'step3') {
      navigate('/complete-profile');
    }else{
      navigate('/register')
    }
  }, [navigate]);

  
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };


  const validateForm = () => {
    const newErrors = {};
  
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!image) newErrors.image = 'Image is required';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;  
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); 

    const formData = new FormData();
    formData.append('FullName', fullName);
    formData.append('UserName', username);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('UserType', userType);
    formData.append('Image', image); 

    try {
      const response = await fetch(`${API_BASE_IMAGE_URL}/Auth/register`, {
        method: 'POST',
        body: formData, 
      });

      setLoading(false); 

      const textResponse = await response.text(); 
      console.log('Response Text:', textResponse); 

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration successful, Please confirm your email', life: 3000 });
        SaveRegistrationProgress(1);
        setTimeout(()=>{
        navigate('/confirm-mail', { state: { email , userType} });
       },3000)
      } else {
        try {
          const errorData = JSON.parse(textResponse); 
          const errorMessage = errorData.errors ? Object.values(errorData.errors).join(", ") : errorData.message || 'Registration failed';
          toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        } catch (error) {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to register, please try again', life: 3000 });
        }
      }
    } catch (error) {
      setLoading(false); 
      console.error('Error:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to register, please try again', life: 3000 });
    }
  };

  return (
    <div className={styles.registerContainer}>
      <Toast ref={toast} />
      <h2 className={styles.title}>Create New Account</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            className={styles.formControl}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            
          />
          {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            className={styles.formControl}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
          {errors.username && <p className={styles.errorText}>{errors.username}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.formControl}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
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
            
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>User Type</label>
          <select
            className={styles.formControl}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Coach">Coach</option>
          </select>
        </div>
        
        {/* Image Upload Box */}
        <div className={styles.imageUploadBox}>
          <label htmlFor="image-upload" className={styles.uploadBox}>
            {imagePreview ? (
              <img src={imagePreview} alt="Image Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.iconWrapper}>
                <span className={styles.plusIcon}>+</span>
                <p className={styles.addText}>Add Photo</p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="image-upload"
             name="image"
            className={styles.fileInput}
            onChange={handleImageChange}
            
            hidden
          />
           {errors.image && <p className={`${styles.errorText} ms-5`}>{errors.image}</p>}
        </div>
       

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default Register;
