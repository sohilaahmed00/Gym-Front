import React, { useState } from 'react';
import styles from './PricingPlans.module.css';
import SignupModal from '../../Modal/SignupModal';

const PricingPlans = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleGetStarted = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.pricingContent}>
        <h2>Choose the Perfect Plan for Your Fitness Journey</h2>
        <p className={styles.pricingSubtitle}>
          Flexible Membership Options to Suit Your Goals and Lifestyle. Find the Right Fit and Start Transforming Your Life Today!
        </p>
        
        <div className={styles.toggleButtons}>
          <button className={`${styles.toggleBtn} ${styles.active}`}>Monthly</button>
          <button className={styles.toggleBtn}>Yearly</button>
        </div>
        
        <div className={styles.planGrid}>
          {/* Basic Plan */}
          <div className={styles.planCard}>
            <h3>Basic plan</h3>
            <div className={styles.price}>$19<span>/mo</span></div>
            <ul>
              <li><span className={styles.checkmark}>✓</span> Unlimited Access to Gym Equipment</li>
              <li><span className={styles.checkmark}>✓</span> Access to Group Fitness Classes</li>
              <li><span className={styles.checkmark}>✓</span> Personalized Workout Plan</li>
              <li><span className={styles.checkmark}>✓</span> Locker Room Access</li>
            </ul>
            <button 
              className={styles.getStartedBtn}
              onClick={() => handleGetStarted('basic')}
            >
              Get Started
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className={`${styles.planCard} ${styles.highlighted}`}>
            <h3>Premium Plan</h3>
            <div className={styles.price}>$40<span>/mo</span></div>
            <ul>
              <li><span className={styles.checkmark}>✓</span> Unlimited Access to Gym Equipment</li>
              <li><span className={styles.checkmark}>✓</span> Access to Group Fitness Classes</li>
              <li><span className={styles.checkmark}>✓</span> Personal Training Session per Month</li>
              <li><span className={styles.checkmark}>✓</span> Nutritional Guidance and Meal Plans</li>
              <li><span className={styles.checkmark}>✓</span> Access to Wellness Programs</li>
            </ul>
            <button 
              className={styles.getStartedBtn}
              onClick={() => handleGetStarted('premium')}
            >
              Get Started
            </button>
          </div>
          
          {/* Elite Plan */}
          <div className={styles.planCard}>
            <h3>Elite Plan</h3>
            <div className={styles.price}>$60<span>/mo</span></div>
            <ul>
              <li><span className={styles.checkmark}>✓</span> All Premium Plan Benefits</li>
              <li><span className={styles.checkmark}>✓</span> Weekly Personal Training Sessions</li>
              <li><span className={styles.checkmark}>✓</span> Customized Advanced Workout Plans</li>
              <li><span className={styles.checkmark}>✓</span> Monthly Wellness Seminars</li>
              <li><span className={styles.checkmark}>✓</span> VIP Access to New Classes</li>
            </ul>
            <button 
              className={styles.getStartedBtn}
              onClick={() => handleGetStarted('elite')}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <SignupModal 
          onClose={() => setShowModal(false)} 
          selectedPlan={selectedPlan}
        />
      )}
    </section>
  );
};

export default PricingPlans; 