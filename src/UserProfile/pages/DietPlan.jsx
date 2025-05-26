import React from 'react';
import userData from '../data/userData.json';
import { Button } from 'primereact/button';

const DietPlan = () => {
  const plan = userData.dietPlan || "Not specified";
  const attachments = userData.attachments || [];

  const mealSchedule = {
    Monday: {
      breakfast: 'Oats with banana 🍌',
      lunch: 'Grilled chicken with rice 🍗',
      dinner: 'Greek yogurt with almonds 🥣',
      snack: '1 apple 🍎',
    },
    Tuesday: {
      breakfast: 'Boiled eggs + toast 🥚🍞',
      lunch: 'Tuna salad 🥗',
      dinner: 'Vegetable soup 🥦',
      snack: 'Handful of nuts 🥜',
    },
    Wednesday: {
      breakfast: 'Smoothie with protein 🥤',
      lunch: 'Beef + sweet potato 🥩',
      dinner: 'Cottage cheese + cucumber 🧀',
      snack: 'Orange 🍊',
    },
    Thursday: {
      breakfast: 'Peanut butter sandwich 🥪',
      lunch: 'Grilled fish + broccoli 🐟',
      dinner: 'Lentil soup 🥣',
      snack: '2 dates + green tea 🌿',
    },
    Friday: {
      breakfast: 'Omelette with veggies 🍳',
      lunch: 'Pasta + grilled veggies 🍝',
      dinner: 'Low fat cheese sandwich 🥪',
      snack: 'Banana 🍌',
    },
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4" style={{ color: '#fd5c28' }}>🥗 Your Diet Plan</h3>

      {/* Summary Plan */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-2">📋 Plan Summary</h5>
        <p className="text-muted">{plan}</p>
      </div>

      {/* Meal Schedule */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">🗓️ Weekly Meal Schedule</h5>

        {Object.entries(mealSchedule).map(([day, meals]) => (
          <div key={day} className="mb-3">
            <h6 className="fw-bold">{day}</h6>
            <ul className="list-group list-group-flush mb-2">
              <li className="list-group-item d-flex justify-content-between">
                <strong>Breakfast:</strong> <span>{meals.breakfast}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Lunch:</strong> <span>{meals.lunch}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Dinner:</strong> <span>{meals.dinner}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Snack:</strong> <span>{meals.snack}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Attachments */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">📎 Attachments</h5>
        {attachments.length === 0 ? (
          <p className="text-muted">No attachments provided by the coach.</p>
        ) : (
          <ul className="list-group">
            {attachments.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {file.name}
                <a href={file.url} target="_blank" rel="noreferrer">
                  <Button label="View" icon="pi pi-eye" className="p-button-sm p-button-outlined" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DietPlan;
