import React, { useState } from 'react';
import styles from './DietPlan.module.css';

function DietPlan() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const dietPlans = [
    {
      id: 1,
      name: "Weight Loss Plan",
      price: 99,
      description: "Perfect for those looking to lose weight in a healthy and sustainable way. This plan includes balanced meals and portion control.",
      features: [
        "Customized meal plans",
        "Weekly grocery lists",
        "Nutritional guidance",
        "Progress tracking",
        "24/7 support"
      ],
      protein: 120,
      carbs: 150,
      fats: 45,
      duration: "3 months",
      level: "Beginner"
    },
    {
      id: 2,
      name: "Muscle Gain Plan",
      price: 129,
      description: "Designed for those looking to build muscle mass. High protein, balanced macros, and strategic meal timing.",
      features: [
        "High protein meal plans",
        "Supplement guidance",
        "Pre/post workout nutrition",
        "Macro tracking",
        "Expert consultation"
      ],
      protein: 180,
      carbs: 250,
      fats: 70,
      duration: "3 months",
      level: "Intermediate"
    },
    {
      id: 3,
      name: "Athletic Performance",
      price: 149,
      description: "Optimize your athletic performance with this specialized nutrition plan. Perfect for athletes and active individuals.",
      features: [
        "Performance-focused meals",
        "Hydration strategies",
        "Recovery nutrition",
        "Competition preparation",
        "Personalized adjustments"
      ],
      protein: 160,
      carbs: 300,
      fats: 60,
      duration: "3 months",
      level: "Advanced"
    },
    {
      id: 4,
      name: "Vegetarian Plan",
      price: 89,
      description: "Plant-based nutrition plan that ensures you get all necessary nutrients while maintaining a vegetarian lifestyle.",
      features: [
        "Plant-based meal plans",
        "Protein alternatives",
        "Vitamin guidance",
        "Recipe collection",
        "Nutritional support"
      ],
      protein: 100,
      carbs: 200,
      fats: 50,
      duration: "3 months",
      level: "Beginner"
    }
  ];

  return (
    <div className={styles.dietPlanPage}>
      <div className={styles.pageTitle}>
        <h1>Diet Plans</h1>
        <p>Choose the perfect diet plan for your goals!</p>
      </div>

      <div className={styles.plansContainer}>
        {dietPlans.map(plan => (
          <div 
            key={plan.id} 
            className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className={styles.planHeader}>
              <h2>{plan.name}</h2>
              <span className={styles.price}>${plan.price}</span>
            </div>
            
            <div className={styles.planDetails}>
              <p className={styles.description}>{plan.description}</p>
              
              <div className={styles.features}>
                <h3>Features:</h3>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.macros}>
                <h3>Daily Macros:</h3>
                <div className={styles.macroGrid}>
                  <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{plan.protein}g</span>
                    <span className={styles.macroLabel}>Protein</span>
                  </div>
                  <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{plan.carbs}g</span>
                    <span className={styles.macroLabel}>Carbs</span>
                  </div>
                  <div className={styles.macroItem}>
                    <span className={styles.macroValue}>{plan.fats}g</span>
                    <span className={styles.macroLabel}>Fats</span>
                  </div>
                </div>
              </div>

              <div className={styles.planInfo}>
                <div className={styles.infoItem}>
                  <i className="fas fa-clock"></i>
                  <span>Duration: {plan.duration}</span>
                </div>
                <div className={styles.infoItem}>
                  <i className="fas fa-signal"></i>
                  <span>Level: {plan.level}</span>
                </div>
              </div>
            </div>

            <button className={styles.selectButton}>
              {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DietPlan; 