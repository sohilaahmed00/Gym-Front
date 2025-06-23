import React from 'react';
import styles from './ServicesSection.module.css';
import { Link } from 'react-router-dom';
import personalTraining from '../../images/personal-training.png';
import groupFitness from '../../images/group-fitness.png';
import nutrition from '../../images/nutrition.png';
import wellness from '../../images/wellness.png';
import cardio from '../../images/cardio.png';
import strength from '../../images/strength.png';

const services = [
  {
    title: "Personal Training",
    description: "Get customized workouts and one-on-one coaching from our expert trainers to achieve your specific fitness goals.",
    image: personalTraining,
    path: "/services/personal-training",
  },
  {
    title: "Group Fitness Classes",
    description: "Join our dynamic and motivating group classes, ranging from yoga to high-intensity interval training, designed for all fitness levels.",
    image: groupFitness,
    path: "/services/group-fitness",
  },
  {
    title: "Nutritional Guidance",
    description: "Nutrition plans and advice from our certified nutritionists to complement your fitness routine and enhance your results.",
    image: nutrition,
    path: "/services/nutritional-guidance",
  },
  {
    title: "Wellness Programs",
    description: "Wellness programs that include stress management, mental well-being, and recovery techniques to support your overall health.",
    image: wellness,
    path: "/services/wellness-programs",
  },
  {
    title: "Cardio Workouts",
    description: "Boost your endurance and cardiovascular health with our variety of cardio classes and equipment, tailored to all fitness levels.",
    image: cardio,
    path: "/services/cardio-workouts",
  },
  {
    title: "Strength Training",
    description: "Build muscle and increase strength with our structured strength training programs and state-of-the-art weightlifting equipment.",
    image: strength,
    path: "/services/strength-training",
  }
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