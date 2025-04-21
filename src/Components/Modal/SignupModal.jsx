import React, { useState, useEffect } from 'react';
import styles from './SignupModal.module.css';
import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaCreditCard, FaLock } from 'react-icons/fa';

const PLANS = {
  basic: {
    name: 'Basic Plan',
    duration: 1, // 1 month
    price: 19
  },
  quarter: {
    name: 'Quarter Plan',
    duration: 3, // 3 months
    price: 49
  },
  half: {
    name: 'Half Year Plan',
    duration: 6, // 6 months
    price: 89
  }
};

const SignupModal = ({ onClose, selectedPlan }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    plan: selectedPlan || '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
    goals: [],
    // Payment fields
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isProcessing: false
  });

  const navigate = useNavigate();

  const calculateEndDate = (startDate, plan) => {
    if (!startDate || !plan) return '';
    const date = new Date(startDate);
    const duration = PLANS[plan]?.duration || 0;
    date.setMonth(date.getMonth() + duration);
    return date.toISOString().split('T')[0];
  };

  const calculateTotalAmount = (plan) => {
    return PLANS[plan]?.price || 0;
  };

  useEffect(() => {
    if (formData.plan) {
      const totalAmount = calculateTotalAmount(formData.plan);
      setFormData(prev => ({
        ...prev,
        totalAmount,
        endDate: calculateEndDate(prev.startDate, formData.plan)
      }));
    }
  }, [formData.plan]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      if (name === 'startDate') {
        updates.endDate = calculateEndDate(value, prev.plan);
      }
      
      if (name === 'plan') {
        updates.totalAmount = calculateTotalAmount(value);
        updates.endDate = calculateEndDate(prev.startDate, value);
      }

      if (name === 'cardNumber') {
        updates[name] = formatCardNumber(value);
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    setFormData(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      setStep(4); // Show thank you screen
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setFormData(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleBackToHome = () => {
    onClose();
    navigate('/');
  };

  const goals = [
    'Weight Loss', 'Muscle Gain', 'Endurance', 
    'Flexibility', 'Strength', 'General Fitness',
    'Athletic Performance', 'Body Recomposition', 'Wellness'
  ];

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>Basic Details</h2>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone no"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
              <div className={styles.row}>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.row}>
                <input
                  type="number"
                  name="height"
                  placeholder="Enter height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <input
                  type="number"
                  name="weight"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <h2>Membership Details</h2>
            <div className={styles.formGroup}>
              <div className={styles.planSelection}>
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`${styles.planCard} ${formData.plan === key ? styles.selectedPlan : ''}`}
                    onClick={() => handleInputChange({ target: { name: 'plan', value: key } })}
                  >
                    <h3>{plan.name}</h3>
                    <div className={styles.planPrice}>${plan.price}</div>
                    <div className={styles.planDuration}>{plan.duration} {plan.duration === 1 ? 'Month' : 'Months'}</div>
                  </div>
                ))}
              </div>
              
              <div className={styles.dateFields}>
                <div className={styles.dateField}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className={styles.dateField}>
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    className={styles.input}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.goalsGrid}>
                {goals.map((goal, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.goalBtn} ${formData.goals.includes(goal) ? styles.active : ''}`}
                    onClick={() => handleGoalToggle(goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <h2>Payment Details</h2>
            <div className={styles.paymentSummary}>
              <div className={styles.summaryItem}>
                <span>Selected Plan:</span>
                <span>{PLANS[formData.plan]?.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Duration:</span>
                <span>{PLANS[formData.plan]?.duration} {PLANS[formData.plan]?.duration === 1 ? 'Month' : 'Months'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Start Date:</span>
                <span>{formData.startDate}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>End Date:</span>
                <span>{formData.endDate}</span>
              </div>
              <div className={`${styles.summaryItem} ${styles.total}`}>
                <span>Total Amount:</span>
                <span>${formData.totalAmount}</span>
              </div>
            </div>
            
            <div className={styles.paymentForm}>
              <div className={styles.securePayment}>
                <FaLock /> Secure Payment
              </div>
              
              <div className={styles.cardIcon}>
                <FaCreditCard />
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    maxLength="19"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on card"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      maxLength="5"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      maxLength="3"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.thankYouContent}>
            <div className={styles.successIcon}>✓</div>
            <h2>Payment Successful!</h2>
            <p>Thank you for joining GymMate. Your membership is now active.</p>
            <button onClick={handleBackToHome} className={styles.backButton}>
              Back To Home
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.logo}>
            <FaDumbbell size={24} color="#FF5722" />
            <span>Join us Now!!</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.progressBar}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Basic Detail</span>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Membership Detail</span>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
        </div>

        {renderStep()}

        {step < 4 && (
          <button 
            className={`${styles.nextButton} ${formData.isProcessing ? styles.processing : ''}`}
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={formData.isProcessing}
          >
            {formData.isProcessing ? 'Processing...' : step === 3 ? 'Pay Now' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SignupModal; 