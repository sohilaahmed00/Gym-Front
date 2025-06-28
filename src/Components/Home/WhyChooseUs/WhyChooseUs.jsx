import React from 'react';
import styles from './WhyChooseUs.module.css';
import gym1 from '../../images/Screenshot 2025-06-27 231125.png';
import gym2 from '../../images/Screenshot 2025-06-27 232453.png';
import gym3 from '../../images/Screenshot 2025-06-27 233722.png';
import gym4 from '../../images/Screenshot 2025-06-27 233514.png';

const WhyChooseUs = () => {
  return (
    <div className={`why_choose_us ${styles.section2}`}>
      <div className={styles.section2Content}>
        <h2>Why Choose Us</h2>
        <p className={styles.section2Subtitle}>
          Discover the unique features that make your fitness journey smarter and easier with us.
        </p>
        
        <div className={` ${styles.featuresGrid}`}>
          <div className={styles.featuresLeft}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💻</span>
              <div className={styles.featureText}>
                <h3>Personalized Online Training</h3>
                <p>Get customized workout plans tailored to your goals, delivered directly to you by professional coaches.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🧑‍🏫</span>
              <div className={styles.featureText}>
                <h3>Direct Access to Coaches</h3>
                <p>Subscribe and connect with certified coaches for real-time guidance, support, and progress tracking.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>🤖</span>
              <div className={styles.featureText}>
                <h3>AI-Powered Fitness Chatbot</h3>
                <p>Chat with our smart AI assistant to receive instant workout suggestions, ready-made routines, and nutrition tips anytime.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📋</span>
              <div className={styles.featureText}>
                <h3>Ready-to-Use Workout & Nutrition Plans</h3>
                <p>Access a variety of pre-designed workout programs and meal plans to suit your lifestyle and fitness level.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>🧮</span>
              <div className={styles.featureText}>
                <h3>Advanced Calorie Calculator</h3>
                <p>Easily track your daily calorie needs and optimize your diet for better results.</p>
              </div>
            </div>
          </div>

          <div className={styles.imagesZigzag}>
            <img src={gym1} alt="Feature 1" className={styles.imgZigzag1} />
            <img src={gym2} alt="Feature 2" className={styles.imgZigzag2} />
            <img src={gym3} alt="Feature 3" className={styles.imgZigzag3} />
            <img src={gym4} alt="Feature 4" className={styles.imgZigzag4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs; 