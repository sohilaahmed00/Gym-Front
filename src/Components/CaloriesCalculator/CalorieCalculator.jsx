import React, { useState } from 'react';
import styles from './CalorieCalculator.module.css';
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

    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Apply activity level multiplier
    let activityMultiplier;
    switch (formData.activityLevel) {
      case 'low':
        activityMultiplier = 1.2;
        break;
      case 'medium':
        activityMultiplier = 1.55;
        break;
      case 'high':
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
        adjustedCalories = tdee - 500;
        goalMessage = `To lose weight, aim for 500 calories below your maintenance level.`;
        break;
      case 'gain':
        adjustedCalories = tdee + 500;
        goalMessage = `To gain muscle, aim for 500 calories above your maintenance level.`;
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
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                Female
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
              <option value="low">Low (little or no exercise)</option>
              <option value="medium">Medium (moderate exercise 3-5 times/week)</option>
              <option value="high">High (intense exercise or sports daily)</option>
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
              <h3>Your Daily Calorie Needs</h3>
              <p className={styles.calories}>{result.adjustedCalories} calories</p>
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