import React from 'react';
import styles from './ServicesSection.module.css';
import { Link } from 'react-router-dom';
import personalTraining from '../../images/personal-training.png';
import groupFitness from '../../images/group-fitness.png';
import nutrition from '../../images/nutrition.png';
import wellness from '../../images/wellness.png';
import cardio from '../../images/cardio.png';
import strength from '../../images/strength.png';
import img1 from '../../images/Screenshot 2025-06-28 010109.png';
import img2 from '../../images/Screenshot 2025-06-28 010832.png';
import img3 from '../../images/Screenshot 2025-06-28 012952.png';

const services = [
  {
    title: "Personalized Workout Plans",
    description: "Create customized workout routines based on each user's fitness level, goals, and body data—delivered through an interactive and dynamic interface.",
    image: img1,
    path: "#",
  },
  {
    title: "AI-Powered Virtual Assistant",
    description: "Get 24/7 support from our smart chatbot, trained to answer fitness and nutrition questions, offer suggestions, and guide you through your journey.",
    image: img2,
    path: "#",
  },
  {
    title: "Coach Subscription & Monitoring",
    description: "Subscribe to certified coaches who can track your progress, assign tasks, and adjust your workout and meal plans in real time.",
    image: img3,
    path: "#",
  },
];

const Services = () => {
  return (
    <section className={`services_section ${styles.servicesSection}`}>
      <div className={styles.servicesContent}>
        <h2>Premium Fitness Services</h2>
        <p className={styles.servicesSubtitle}>
          Tailored Workouts, Expert Guidance, and Comprehensive Programs to Meet All Your Fitness Needs
        </p>
        
        <div className={` ${styles.servicesGrid}`}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceImageContainer}>
                <img src={service.image} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 