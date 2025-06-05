import React from "react";
import styles from "./Home.module.css";
import HeroSection from "./HeroSection/HeroSection";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import Services from "./ServicesSection/ServicesSection";
import PricingPlans from "./PricingPlans/PricingPlans";
import IntroTour from "../IntroJs/IntroTour";

const Home = () => {
  return (
    <div className={styles.home}>
      <IntroTour />
      <HeroSection />
      <WhyChooseUs />
      <Services />
      <PricingPlans />
    </div>
  );
};

export default Home;
