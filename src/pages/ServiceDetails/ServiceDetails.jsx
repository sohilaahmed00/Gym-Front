import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ServiceDetails.module.css';

// Assuming the services data is available or can be imported/fetched
// For now, I'll use a dummy data structure similar to the one in ServicesSection
const allServices = [
  {
    path: "personal-training",
    title: "Personal Training",
    description: "Get customized workouts and one-on-one coaching from our expert trainers to achieve your specific fitness goals.",
    // Add more details like benefits, trainer info, images, etc.
    details: "Detailed information about personal training, including trainer profiles, success stories, and how to book a session.",
    image: '/path/to/personal-training-image.jpg', // Replace with actual image path
    features: [
      "Personalized workout plans",
      "Expert trainer guidance",
      "One-on-one sessions",
      "Progress tracking",
    ],
    benefits: [
      "Achieve your fitness goals faster",
      "Learn proper form and technique",
      "Stay motivated and accountable",
      "Reduce risk of injury",
    ],
    trainers: [
      { id: 1, name: "Ahmed Salah", specialty: "Strength & Conditioning", image: '/path/to/trainer1-image.jpg' },
      { id: 2, name: "Fatma Ali", specialty: "Weight Loss & Nutrition", image: '/path/to/trainer2-image.jpg' },
    ],
    pricing: [
      { duration: "1 Month", price: 1500, description: "One-month personalized training" },
      { duration: "3 Months", price: 4000, description: "Three-month personalized training program" },
      { duration: "6 Months", price: 7500, description: "Six-month comprehensive training plan" },
    ],
    plans: [
      { name: "Basic", features: ["2 sessions/week", "Basic plan"]} , // Example plan structure
      { name: "Pro", features: ["4 sessions/week", "Advanced plan"]} , // Example plan structure
    ]
  },
  {
    path: "group-fitness",
    title: "Group Fitness Classes",
    description: "Join our dynamic and motivating group classes, ranging from yoga to high-intensity interval training, designed for all fitness levels.",
    details: "Find out more about our diverse range of group classes, schedules, and how to join a class.",
    image: '/path/to/group-fitness-image.jpg', // Replace with actual image path
    features: [
      "Variety of class types",
      "Motivating group environment",
      "Classes for all fitness levels",
      "Certified instructors",
    ],
    benefits: [
      "Improve cardiovascular health",
      "Increase strength and flexibility",
      "Burn calories and manage weight",
      "Have fun while working out",
    ],
    trainers: [], // Add specific trainers for group fitness if applicable
    pricing: [], // Add pricing for group classes, e.g., per class or membership
    plans: [], // Add class schedules or membership tiers
  },
  {
    path: "nutritional-guidance",
    title: "Nutritional Guidance",
    description: "Nutrition plans and advice from our certified nutritionists to complement your fitness routine and enhance your results.",
    details: "Learn about our nutritional counseling services, meal planning options, and how our nutritionists can help you reach your health goals.",
    image: '/path/to/nutrition-image.jpg', // Replace with actual image path
    features: [
      "Personalized meal plans",
      "Certified nutritionist consultations",
      "Dietary analysis and advice",
      "Support for various dietary needs",
    ],
    benefits: [
      "Optimize your diet for fitness",
      "Improve energy levels",
      "Support weight management",
      "Develop healthy eating habits",
    ],
    trainers: [], // Add specific nutritionists if applicable
    pricing: [], // Add pricing for consultations or plans
    plans: [], // Add different plan options
  },
    {
    path: "wellness-programs",
    title: "Wellness Programs",
    description: "Wellness programs that include stress management, mental well-being, and recovery techniques to support your overall health.",
    details: "Explore our wellness programs designed to enhance your overall well-being, including stress reduction techniques, mindfulness, and recovery.",
    image: '/path/to/wellness-image.jpg', // Replace with actual image path
    features: [
      "Stress management techniques",
      "Mental well-being support",
      "Recovery strategies",
      "Holistic approach to health",
    ],
    benefits: [
      "Reduce stress and anxiety",
      "Improve mental clarity",
      "Enhance recovery and prevent burnout",
      "Achieve overall well-being",
    ],
    trainers: [], // Add relevant trainers/practitioners
    pricing: [], // Add pricing information
    plans: [], // Add program structures or options
  },
  {
    path: "cardio-workouts",
    title: "Cardio Workouts",
    description: "Boost your endurance and cardiovascular health with our variety of cardio classes and equipment, tailored to all fitness levels.",
    details: "Discover our wide range of cardio options, from high-energy classes to state-of-the-art equipment, suitable for all fitness levels.",
    image: '/path/to/cardio-image.jpg', // Replace with actual image path
    features: [
      "Wide variety of cardio machines",
      "High-energy cardio classes",
      "Programs for all fitness levels",
      "Expert guidance on cardio training",
    ],
    benefits: [
      "Improve cardiovascular endurance",
      "Burn calories and lose weight",
      "Boost metabolism",
      "Reduce risk of chronic diseases",
    ],
    trainers: [], // Add relevant trainers/instructors
    pricing: [], // Add pricing information (e.g., access to cardio zone)
    plans: [], // Add workout plans or access levels
  },
  {
    path: "strength-training",
    title: "Strength Training",
    description: "Build muscle and increase strength with our structured strength training programs and state-of-the-art weightlifting equipment.",
    details: "Learn how our strength training programs can help you build muscle, increase strength, and improve your overall fitness using our advanced equipment.",
    image: '/path/to/strength-image.jpg', // Replace with actual image path
    features: [
      "Structured training programs",
      "State-of-the-art weightlifting equipment",
      "Guidance from certified trainers",
      "Focus on proper form",
    ],
    benefits: [
      "Build muscle and increase strength",
      "Improve body composition",
      "Boost metabolism",
      "Increase bone density",
    ],
    trainers: [], // Add relevant trainers/coaches
    pricing: [], // Add pricing information (e.g., access or specific programs)
    plans: [], // Add training program structures
  }
];

const ServiceDetails = () => {
  const { serviceName } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const foundService = allServices.find(s => s.path === serviceName);
    setService(foundService);
  }, [serviceName]);

  if (!service) {
    return <div className={styles.loading}>Loading service details...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{service.title}</h1>
      <p className={styles.description}>{service.description}</p>

      {service.image && (
        <div className={styles.imageContainer}>
          <img src={service.image} alt={service.title} />
        </div>
      )}

      <div className={styles.details}>
        <h3>Details</h3>
        <p>{service.details}</p>

        {service.features && service.features.length > 0 && (
          <div className={styles.featuresSection}>
            <h4 className={styles.sectionTitle}>Key Features</h4>
            <ul className={styles.featuresList}>
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {service.benefits && service.benefits.length > 0 && (
          <div className={styles.benefitsSection}>
            <h4 className={styles.sectionTitle}>Benefits</h4>
            <ul className={styles.benefitsList}>
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {service.trainers && service.trainers.length > 0 && (
          <div className={styles.trainersSection}>
            <h4 className={styles.sectionTitle}>Meet Our Trainers</h4>
            <div className={styles.trainersGrid}>
              {service.trainers.map(trainer => (
                <div key={trainer.id} className={styles.trainerCard}>
                  {trainer.image && <img src={trainer.image} alt={trainer.name} className={styles.trainerImage} />}
                  <h5 className={styles.trainerName}>{trainer.name}</h5>
                  <p className={styles.trainerSpecialty}>{trainer.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.pricing && service.pricing.length > 0 && (
          <div className={styles.pricingSection}>
            <h4 className={styles.sectionTitle}>Pricing Options</h4>
            <div className={styles.pricingGrid}>
              {service.pricing.map((price, index) => (
                <div key={index} className={styles.priceCard}>
                  <h5 className={styles.priceDuration}>{price.duration}</h5>
                  <p className={styles.priceAmount}>EGP {price.price.toFixed(2)}</p>
                  <p className={styles.priceDescription}>{price.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

         {service.plans && service.plans.length > 0 && (
          <div className={styles.plansSection}>
            <h4 className={styles.sectionTitle}>Available Plans</h4>
            <div className={styles.plansGrid}>
              {service.plans.map((plan, index) => (
                <div key={index} className={styles.planCard}>
                  <h5 className={styles.planName}>{plan.name}</h5>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((feature, featIndex) => (
                      <li key={featIndex}>{feature}</li>
                    ))}
                  </ul>
                  {/* Add a button to select/learn more about the plan */}
                   <button className={styles.planButton}>Choose Plan</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add more detailed content here */}
      </div>

      {/* Add images, testimonials, forms, etc. */}
      <a href="#contact" className={styles.ctaButton}>Get Started Today!</a> {/* Example CTA button */}

    </div>
  );
};

export default ServiceDetails; 