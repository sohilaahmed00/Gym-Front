import React from 'react';
import styles from './WhyChooseUs.module.css';
import gym1 from '../../images/Rectangle 30.png';
import gym2 from '../../images/Rectangle 31.png';
import gym3 from '../../images/Rectangle 32.png';

const WhyChooseUs = () => {
  return (
    <section className={styles.section2}>
      <div className={styles.section2Content}>
        <h2>Why Choose Us</h2>
        <p className={styles.section2Subtitle}>
          Discover the Benefits That Set Us Apart and Propel Your Fitness Journey Forward.
        </p>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featuresLeft}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>👨‍🏫</span>
              <div className={styles.featureText}>
                <h3>Expert Trainers</h3>
                <p>Our certified trainers provide personalized guidance and expert advice to help you achieve your fitness goals.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🏋️</span>
              <div className={styles.featureText}>
                <h3>State-of-the-Art Equipment</h3>
                <p>Work out with the latest and most advanced fitness equipment to maximize your results and enhance your experience.</p>
              </div>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>📋</span>
              <div className={styles.featureText}>
                <h3>Comprehensive Programs</h3>
                <p>Enjoy a variety of classes and programs tailored to all fitness levels, from beginner to advanced.</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🤝</span>
              <div className={styles.featureText}>
                <h3>Supportive Community</h3>
                <p>Be part of a positive and motivating community that encourages you to stay consistent and push your limits.</p>
              </div>
            </div>
          </div>

          <div className={styles.imagesGrid}>
            <div className={styles.imagesLeft}>
              <img src={gym1} alt="Gym facility 1" />
              <img src={gym2} alt="Gym facility 2" />
            </div>
            <div className={styles.imageRight}>
              <img src={gym3} alt="Gym facility 3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 