import React from 'react';
import styles from './HeroSection.module.css';
import { Link } from 'react-router-dom';
import heroImage from '../../images/Home.png';
import { checkLoginStatus } from '../../../services/IsLoggedIn';

const HeroSection = () => {
  const isLoggedIn = checkLoginStatus();
  return (
    <section className={`hero_section ${styles.heroSection} `}>
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
        {!isLoggedIn && (
        <div className={styles.heroButtons}>
          <Link to="/register" className={styles.getStartedButton}>
            Get Started <span>→</span>
          </Link>
        </div>
        )}
      </div>
      <div className={styles.heroImageContainer}>
        <img src={heroImage} alt="Fitness trainers" className={styles.heroImage} />
      </div>
    </section>
  );
};

export default HeroSection; 