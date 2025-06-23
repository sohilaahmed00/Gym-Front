// CalendarDayBox.js
import React from 'react';

const CalendarDayBox = ({ dayObj, assignments = [], nutritionPlans = [], openModal, isSameDate }) => {
  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const safeNutritionPlans = Array.isArray(nutritionPlans) ? nutritionPlans : [];

  const hasAssignment = safeAssignments.some(a => isSameDate(a.day, dayObj.date));
  const hasNutrition = safeNutritionPlans.some(n => isSameDate(n.day, dayObj.date));

  const assignmentOfDay = safeAssignments.find(a => isSameDate(a.day, dayObj.date));
  const workoutName = assignmentOfDay?.exercises?.map(ex => ex.exercise_Name).join(', ') || null;

  const date = new Date(dayObj.date);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="col-md-3 text-center g-3">
      <div
        className="card p-3 shadow-sm"
        style={{ width: '90%', height: '200px', minWidth: 220, cursor: 'pointer' }}
        onClick={() => openModal(dayObj.date)}
      >
        <strong>{weekday}</strong>
        <div>{dayObj.date}</div>
        <div style={{ fontSize: '1.2rem', margin: '6px 0' }}>
          {hasAssignment && '🏋️'} {hasNutrition && '🍎'}
        </div>
        <div className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>
          {workoutName || `🎯 Add today's plan!`}
        </div>
        <button className={`btn btn-sm btn-${hasAssignment || hasNutrition ? 'warning' : 'primary'}`}>
          {hasAssignment || hasNutrition ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default CalendarDayBox;
