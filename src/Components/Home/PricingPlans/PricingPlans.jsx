import React, { useState } from 'react';
import styles from './PricingPlans.module.css';
import SignupModal from '../../Modal/SignupModal';
import { useNavigate } from 'react-router-dom';
import { checkLoginStatus } from '../../../services/IsLoggedIn';

const PricingPlans = () => {
  const navigate = useNavigate();

  const planApiNames = {
    '3 Months Plan': '3_Months',
    '6 Months Plan': '6_Months',
    '1 Year Plan': '1_Year',
  };

  const handleSubscribe = (planDisplayName) => {
    if (!checkLoginStatus()) {
      alert('You must log in first!');
      navigate('/login');
      return;
    }
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
            <li><span className={styles.checkmark}>✅</span> Full access to the GymMate</li>
            <li><span className={styles.checkmark}>🏋️</span> Personalized workout plan</li>
            <li><span className={styles.checkmark}>🍱</span> Nutrition plan based to your caloric needs </li>
            <li><span className={styles.checkmark}>📊</span> Progress tracking & analysis</li>
            <li><span className={styles.checkmark}>✏️</span> Update personal data</li>
            <li><span className={styles.checkmark}>💬</span> 24/7 chat support with the intelligent assistant</li>
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
          <h3> 6 Months Plan</h3>
          <div className={styles.price}>1200 EGP</div>
          <ul>
            <li><span className={styles.checkmark}>✅</span> Full access to the GymMate</li>
            <li><span className={styles.checkmark}>🏋️</span> Personalized workout plan</li>
            <li><span className={styles.checkmark}>🍱</span> Nutrition plan based to your caloric needs </li>
            <li><span className={styles.checkmark}>💬</span> 24/7 chat support with the intelligent assistant</li>
            <li><span className={styles.checkmark}>⏳</span> Extended duration for consistent progress</li>
            <li><span className={styles.checkmark}>💸</span> More cost-effective in the long run</li>
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
            <li><span className={styles.checkmark}>🏋️</span> Personalized workout plan</li>
            <li><span className={styles.checkmark}>🍱</span> Nutrition plan based to your caloric needs </li>
            <li><span className={styles.checkmark}>💬</span> 24/7 chat support with the intelligent assistant</li>
            <li><span className={styles.checkmark}>⏳</span> Extended duration for consistent progress</li>
            <li><span className={styles.checkmark}>💸</span> More cost-effective in the long run</li>
            <li><span className={styles.checkmark}>📆</span> Full-year support for long-term transformation</li>
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