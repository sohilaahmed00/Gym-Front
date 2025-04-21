import React from 'react';
 import styles from './Home.module.css';
 import HeroSection from './HeroSection/HeroSection';
 import WhyChooseUs from './WhyChooseUs/WhyChooseUs';
 import Services from './ServicesSection/ServicesSection';
 import PricingPlans from './PricingPlans/PricingPlans';

 const Home = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <WhyChooseUs />
      <Services />
      <PricingPlans />
      </div>
   );
 };
 
 export default Home;