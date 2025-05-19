import React, { useState } from 'react';
import styles from './NutritionPlan.module.css';

function NutritionPlan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('vegetarian');

  // خطط نباتية
  const vegetarianPlans = [
    {
      id: 1,
      name: "خطة نباتية 1100 سعرة حرارية",
      emoji: "🥦",
      description: "منخفضة جداً في السعرات وغنية بالألياف.",
      calories: 1100,
      meals: [
        { type: "الإفطار", emoji: "🥑", content: "توست أسمر + أفوكادو", calories: 200 },
        { type: "الغداء", emoji: "🥗", content: "سلطة حمص + خبز أسمر", calories: 350 },
        { type: "العشاء", emoji: "🍠", content: "بطاطا مشوية + سلطة خضراء", calories: 400 },
        { type: "سناك", emoji: "🍎", content: "تفاحة", calories: 150 }
      ],
      totalCalories: 1100
    },
    // ... existing code ...
  ];

  // خطط غير نباتية
  const nonVegetarianPlans = [
    {
      id: 1,
      name: "خطة بروتين 2000 سعرة حرارية",
      emoji: "🥩",
      description: "غنية بالبروتين لبناء العضلات.",
      calories: 2000,
      meals: [
        { type: "الإفطار", emoji: "🍳", content: "بيض + توست أسمر + أفوكادو", calories: 450 },
        { type: "الغداء", emoji: "🍗", content: "صدر دجاج مشوي + أرز بني + خضار", calories: 650 },
        { type: "العشاء", emoji: "🥩", content: "ستيك + بطاطا حلوة + سلطة", calories: 700 },
        { type: "سناك", emoji: "🥛", content: "بروتين شيك", calories: 200 }
      ],
      totalCalories: 2000
    },
    {
      id: 2,
      name: "خطة متوازنة 1800 سعرة حرارية",
      emoji: "🍖",
      description: "توازن بين البروتين والكربوهيدرات.",
      calories: 1800,
      meals: [
        { type: "الإفطار", emoji: "🥣", content: "شوفان + حليب + موز", calories: 400 },
        { type: "الغداء", emoji: "🍗", content: "دجاج مشوي + أرز + خضار", calories: 600 },
        { type: "العشاء", emoji: "🐟", content: "سمك + بطاطا + سلطة", calories: 600 },
        { type: "سناك", emoji: "🥜", content: "مكسرات", calories: 200 }
      ],
      totalCalories: 1800
    },
    {
      id: 3,
      name: "خطة كيتو 1600 سعرة حرارية",
      emoji: "🥓",
      description: "غنية بالدهون ومنخفضة الكربوهيدرات.",
      calories: 1600,
      meals: [
        { type: "الإفطار", emoji: "🥓", content: "بيض + بيكون + أفوكادو", calories: 500 },
        { type: "الغداء", emoji: "🥩", content: "ستيك + خضار مشوي", calories: 600 },
        { type: "العشاء", emoji: "🍗", content: "دجاج مشوي + سلطة", calories: 400 },
        { type: "سناك", emoji: "🧀", content: "جبنة", calories: 100 }
      ],
      totalCalories: 1600
    }
  ];

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'vegetarian' ? styles.active : ''}`}
          onClick={() => setActiveTab('vegetarian')}
        >
          نباتي
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'nonVegetarian' ? styles.active : ''}`}
          onClick={() => setActiveTab('nonVegetarian')}
        >
          غير نباتي
        </button>
      </div>

      <div className={styles.plansGrid}>
        {(activeTab === 'vegetarian' ? vegetarianPlans : nonVegetarianPlans).map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <div className={styles.planEmoji}>{plan.emoji}</div>
            <h3 className={styles.planName}>{plan.name}</h3>
            <p className={styles.planDescription}>{plan.description}</p>
            <div className={styles.planCalories}>{plan.calories} سعرة حرارية</div>
            <button
              className={styles.viewButton}
              onClick={() => handleViewPlan(plan)}
            >
              [عرض]
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedPlan && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <h2 className={styles.modalTitle}>{selectedPlan.name}</h2>
            <div className={styles.mealsList}>
              {selectedPlan.meals.map((meal, index) => (
                <div key={index} className={styles.mealItem}>
                  <div className={styles.mealHeader}>
                    <span className={styles.mealEmoji}>{meal.emoji}</span>
                    <span className={styles.mealType}>{meal.type}</span>
                  </div>
                  <p className={styles.mealContent}>{meal.content}</p>
                  <div className={styles.mealCalories}>{meal.calories} سعرة حرارية</div>
                </div>
              ))}
            </div>
            <div className={styles.totalCalories}>
              إجمالي السعرات: {selectedPlan.totalCalories} سعرة حرارية
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionPlan; 