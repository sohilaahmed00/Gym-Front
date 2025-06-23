import React, { useState } from 'react';
import styles from './CaloriesCalculator.module.css';
import { Link } from 'react-router-dom';

const CaloriesCalculator = () => {
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: '',
    activityLevel: '',
    goal: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCalories = () => {
    // Reset messages
    setError('');
    setSuccess('');

    // Validate inputs
    if (!formData.gender || !formData.weight || !formData.height || !formData.age || !formData.activityLevel || !formData.goal) {
      setError('Please fill in all required fields.');
      return;
    }

    // Convert to numbers
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    // Validate number inputs
    if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
      setError('Please enter valid numbers in all fields.');
      return;
    }

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
    let bmr;
    if (formData.gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity level multiplier
    let activityMultiplier;
    switch (formData.activityLevel) {
        case 'sedentary':
            activityMultiplier = 1.2;
            break;
        case 'light':
            activityMultiplier = 1.375;
            break;
        case 'moderate':
            activityMultiplier = 1.55;
            break;
        case 'very':
            activityMultiplier = 1.725;
            break;
        case 'super':
            activityMultiplier = 1.9;
            break;
        default:
            activityMultiplier = 1.2;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * activityMultiplier);

    // Adjust based on goal
    let adjustedCalories;
    let goalMessage;
    switch (formData.goal) {
      case 'lose':
        adjustedCalories = { min: tdee - 500, max: tdee - 250 };
        goalMessage = `To lose weight, aim for a daily intake between ${tdee - 500} and ${tdee - 250} calories.`;
        break;
      case 'gain':
        adjustedCalories = { min: tdee + 250, max: tdee + 500 };
        goalMessage = `To build muscle, aim for a daily intake between ${tdee + 250} and ${tdee + 500} calories.`;
        break;
      case 'maintain':
        adjustedCalories = tdee;
        goalMessage = `To maintain your current weight, your ideal calorie intake is ${tdee} calories.`;
        break;
      default:
        adjustedCalories = tdee;
    }

    setResult({
      tdee,
      adjustedCalories,
      goalMessage
    });
    setSuccess('Your daily calorie needs have been calculated successfully!');
  };

  return (
    <div className={styles.calculatorPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calorie Calculator</h1>
        <p className={styles.subtitle}>
          Discover your daily calorie needs to achieve your fitness goals.
        </p>

        <div className={styles.intro}>
          <p>
            To get the best results in fitness, weight loss, or muscle building, it's essential to know your daily calorie needs. Use our calculator to determine the optimal amount your body requires.
          </p>
        </div>

        <div className={styles.calculatorForm}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.formGroup}>
            <label>Gender</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <span>Male</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight in kilograms"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in centimeters"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age in years"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="very">Very active (hard exercise 6-7 days/week)</option>
              <option value="super">Super active (very hard exercise daily or physical job)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="">Select your goal</option>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Build Muscle</option>
            </select>
          </div>

          <button className={styles.calculateButton} onClick={calculateCalories}>
            Calculate Now
          </button>
        </div>

        {result && (
          <div className={styles.results}>
            <h2>Calculation Results</h2>
            <div className={styles.resultCard}>
              <h3>Daily Maintenance Calories (BMI)</h3>
              <p className={styles.calories}>{result.tdee} calories</p>
              
              {formData.goal !== 'maintain' && (
                <>
                  <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
                  <h3>Your Recommended Intake for Your Goal</h3>
                  <p className={styles.calories}>
                    {typeof result.adjustedCalories === 'object'
                      ? `${result.adjustedCalories.min} - ${result.adjustedCalories.max}`
                      : result.adjustedCalories} calories
                  </p>
                </>
              )}
              
              <p className={styles.goalMessage}>{result.goalMessage}</p>
            </div>
          </div>
        )}

        <div className={styles.infoSection}>
          <h2>What are Calories?</h2>
          <p>
            Calories are units of energy that we get from food and drinks. Your body needs calories to perform basic functions like breathing, digestion, and movement. Knowing your calorie needs helps you achieve your health and fitness goals.
          </p>

          <h2>How to Improve Your Diet?</h2>
          <ul>
            <li>Eat balanced meals containing all nutrients</li>
            <li>Drink enough water daily</li>
            <li>Include fresh vegetables and fruits</li>
            <li>Avoid processed foods and added sugars</li>
            <li>Distribute meals throughout the day</li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h2>Need Additional Help?</h2>
          <p>Contact one of our coaches for a personalized nutrition plan based on your calculator results</p>
          <Link to="/coaches" className={styles.contactButton}>
            Contact a Coach
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaloriesCalculator;
