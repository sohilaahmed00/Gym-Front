import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import heroImage from '../images/Home.png';
import gym1 from '../images/Rectangle 30.png';
import gym2 from '../images/Rectangle 31.png';
import gym3 from '../images/Rectangle 32.png';
import personalTraining from '../images/personal-training.png';
import groupFitness from '../images/group-fitness.png';
import nutrition from '../images/nutrition.png';
import wellness from '../images/wellness.png';
import cardio from '../images/cardio.png';
import strength from '../images/strength.png';

export default function Home() {
  const services = [
    {
      title: "Personal Training",
      description: "Get customized workouts and one-on-one coaching from our expert trainers to achieve your specific fitness goals.",
      image: personalTraining,
    },
    {
      title: "Group Fitness Classes",
      description: "Join our dynamic and motivating group classes, ranging from yoga to high-intensity interval training, designed for all fitness levels.",
      image: groupFitness,
    },
    {
      title: "Nutritional Guidance",
      description: "Nutrition plans and advice from our certified nutritionists to complement your fitness routine and enhance your results.",
      image: nutrition,
    },
    {
      title: "Wellness Programs",
      description: "Wellness programs that include stress management, mental well-being, and recovery techniques to support your overall health.",
      image: wellness,
    },
    {
      title: "Cardio Workouts",
      description: "Boost your endurance and cardiovascular health with our variety of cardio classes and equipment, tailored to all fitness levels.",
      image: cardio,
    },
    {
      title: "Strength Training",
      description: "Build muscle and increase strength with our structured strength training programs and state-of-the-art weightlifting equipment.",
      image: strength,
    }
  ];

  return (
    <div className={styles.home}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>
            TRANSFORM<br />
            YOUR LIFE<br />
            WITH FITLIFE<br />
            STUDIO
          </h1>
          <p>
            Join FitLife Studio Today and Experience Expert Training,
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
      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContent}>
          <h2>Premium Fitness Services</h2>
          <p className={styles.servicesSubtitle}>
            Tailored Workouts, Expert Guidance, and Comprehensive Programs to Meet All Your Fitness Needs
          </p>
          
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceImageContainer}>
                  <img src={service.image} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/services" className={styles.learnMoreBtn}>
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
