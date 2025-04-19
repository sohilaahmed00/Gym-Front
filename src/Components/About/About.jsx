import React from 'react';
import styles from './About.module.css';
import placeholderImage from '../images/Placeholder Image.png';
import Header from "../images/Header.png";

export default function About() {
  return (
    <div className={styles['about-page']}>
      {/* Hero Section with Background Image */}
      <section 
        className={styles['hero-section']} 
        style={{ 
          backgroundImage: `url(${Header})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%'
        }}
      >
        <div className={styles['hero-overlay']}></div>
        <div className={styles['hero-content']}>
          <h1>Discover the Unique Qualities That Set FitLife Studio Apart</h1>
          <p className={styles['hero-text']}>
            Learn How Our Commitment to Excellence, Innovative Programs, and Passionate Community Make FitLife
            Studio the Ultimate Destination for Your Fitness Journey.
          </p>
        </div>
      </section>

      {/* About Content Section */}
      <section className={styles['about-content']}>
        <div className={styles['about-grid']}>
          <div className={styles['about-text-container']}>
            <h2>About FitLife Studio</h2>
            <p className={styles['about-text']}>
              At FitLife Studio, we believe that fitness is more than just a routine, it's a way of life. 
              Founded with the mission to inspire and empower individuals on their fitness journeys, 
              we offer a comprehensive range of services tailored to meet the unique needs of each member. 
              Our state-of-the-art facility, expert trainers, and vibrant community create an environment 
              where everyone can thrive.
            </p>
            
            <div className={styles['mission-section']}>
              <h3>Our Mission</h3>
              <p>
                Our mission is to provide top-tier fitness solutions that help our members achieve their 
                personal health and wellness goals. We are dedicated to fostering a supportive and 
                motivating atmosphere, where every individual feels valued and inspired to push their limits.
              </p>
            </div>
          </div>
          
          <div className={styles['about-image-container']}>
            <img
              src={placeholderImage}
              alt="Fitness equipment at FitLife Studio"
              className={styles['about-image']}
            />
          </div>
        </div>
      </section>
    </div>
  );
}