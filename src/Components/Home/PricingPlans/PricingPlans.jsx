import React, { useState } from 'react';
import styles from './PricingPlans.module.css';
import SignupModal from '../../Modal/SignupModal';
import { useNavigate } from 'react-router-dom';

const PricingPlans = () => {
  const navigate = useNavigate();

  const planApiNames = {
    '3 Months Plan': '3_Months',
    '6 Months Plan': '6_Months',
    '1 Year Plan': '1_Year',
  };

  const handleSubscribe = (planDisplayName) => {
    const apiPlanName = planApiNames[planDisplayName];
    navigate('/subscribe', { state: { plan: apiPlanName } });
  };

  return (
    <section className={`pricing_plan ${styles.pricingSection}`}>
      {/* ... */}
      <div className={styles.planGrid}>

        {/* 3 Months Plan */}
        <div className={styles.planCard}>
          <h3>3 Months Plan</h3>
          <div className={styles.price}>600 EGP</div>
          <ul>
            <li><span className={styles.checkmark}>✓</span> Unlimited Access to Gym Equipment</li>
            <li><span className={styles.checkmark}>✓</span> Access to Group Fitness Classes</li>
            <li><span className={styles.checkmark}>✓</span> Personalized Workout Plan</li>
            <li><span className={styles.checkmark}>✓</span> Locker Room Access</li>
          </ul>
          <button
            className={styles.getStartedBtn}
            onClick={() => handleSubscribe('3 Months Plan')}
          >
            Subscribe Now
          </button>
        </div>

        {/* 6 Months Plan */}
        <div className={`${styles.planCard} ${styles.highlighted}`}>
          <div className={styles.popularBadge}>Most Popular</div>
          <h3 style={{marginTop: '1.5rem'}}>6 Months Plan</h3>
          <div className={styles.price}>1200 EGP</div>
          <ul>
            <li><span className={styles.checkmark}>✓</span> Unlimited Access to Gym Equipment</li>
            <li><span className={styles.checkmark}>✓</span> Access to Group Fitness Classes</li>
            <li><span className={styles.checkmark}>✓</span> Personal Training Session per Month</li>
            <li><span className={styles.checkmark}>✓</span> Nutritional Guidance and Meal Plans</li>
            <li><span className={styles.checkmark}>✓</span> Access to Wellness Programs</li>
          </ul>
          <button
            className={styles.getStartedBtn}
            onClick={() => handleSubscribe('6 Months Plan')}
          >
            Subscribe Now
          </button>
        </div>

        {/* 1 Year Plan */}
        <div className={styles.planCard}>
          <h3>1 Year Plan</h3>
          <div className={styles.price}>1800 EGP</div>
          <ul>
            <li><span className={styles.checkmark}>✓</span> All Premium Plan Benefits</li>
            <li><span className={styles.checkmark}>✓</span> Weekly Personal Training Sessions</li>
            <li><span className={styles.checkmark}>✓</span> Customized Advanced Workout Plans</li>
            <li><span className={styles.checkmark}>✓</span> Monthly Wellness Seminars</li>
            <li><span className={styles.checkmark}>✓</span> VIP Access to New Classes</li>
          </ul>
          <button
            className={styles.getStartedBtn}
            onClick={() => handleSubscribe('1 Year Plan')}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans; 