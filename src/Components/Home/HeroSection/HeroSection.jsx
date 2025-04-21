import React from 'react';
import styles from './HeroSection.module.css';
import { Link } from 'react-router-dom';
import heroImage from '../../images/Home.png';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1>
          TRANSFORM<br />
          YOUR LIFE<br />
          WITH GYMMATE
        </h1>
        <p>
          Join GymMate Today and Experience Expert Training,
          Personalized Programs, and a Supportive Community to
          Achieve Your Fitness Goals.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/signup" className={styles.getStartedButton}>
            Get Started <span>→</span>
          </Link>
        </div>
      </div>
      <div className={styles.heroImageContainer}>
        <img src={heroImage} alt="Fitness trainers" className={styles.heroImage} />
      </div>
    </section>
  );
};

export default HeroSection; 