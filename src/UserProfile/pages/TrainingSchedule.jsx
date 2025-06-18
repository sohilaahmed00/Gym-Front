import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './TrainingSchedule.module.css';
import { isSameDate, parseCustomDate, formatDateForBackend } from '../../services/date';

const TrainingSchedule = () => {
  const [assignments, setAssignments] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useRef(null);
  const userId = localStorage.getItem('id');

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const fetchAllData = async () => {
    try {
      const [assignmentsRes, nutritionRes] = await Promise.all([
        axios.get(`http://gymmatehealth.runasp.net/api/Assignments/GetAllUserAssignments/${userId}`),
        axios.get(`http://gymmatehealth.runasp.net/api/NutritionPlans/GetAllUserNutritionplans/${userId}`)
      ]);

      if (Array.isArray(assignmentsRes.data)) {
        const parseDate = (str) => {
          const [day, month, year] = str.split('-');
          return new Date(`${year}-${month}-${day}`);
        };

        const sortedAssignments = assignmentsRes.data.sort((a, b) => parseDate(a.day) - parseDate(b.day));
        setAssignments(sortedAssignments);
      }

      if (Array.isArray(nutritionRes.data)) {
        const map = {};
        nutritionRes.data.forEach(plan => {
          const key = normalizeNutritionDate(plan.day);
          if (!map[key]) map[key] = plan;
        });
        setNutritionPlans(Object.values(map));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load training data', life: 4000 });
    }
  };

  const normalizeNutritionDate = (dayStr) => {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dayStr)) {
      const [dd, mm, yyyy] = dayStr.split('-');
      return `${yyyy}-${mm}-${dd}`;
    }
    return dayStr;
  };

  const handleMarkDone = async (assignment) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Assignments/CompleteAssignment/${assignment.assignment_ID}`);
      await fetchAllData();
      toast.current.show({
        severity: 'success',
        summary: 'Marked as Done',
        detail: `Day ${assignment.day} marked as done!`,
        life: 3000,
      });
    } catch (error) {
      console.error('Failed to mark as done:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to mark assignment as done',
        life: 3000,
      });
    }
  };

  const handleOpenModal = (assignment) => {
    const nutrition = nutritionPlans.find(n => isSameDate(n.day, assignment.day));
    setSelectedDay({ ...assignment, nutrition });
    setShowModal(true);
  };

  const formatDate = (dateStr) => {
    const d = parseCustomDate(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <div className="container py-4">
      <Toast ref={toast} />
      <h3 className="mb-3" style={{ color: '#fd5c28' }}>📅 Your Training Schedule</h3>

      {assignments.length === 0 ? (
        <p className="text-muted">No training assignments available.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {assignments.map(assignment => {
            const dateObj = parseCustomDate(assignment.day);
            const label = `${formatDate(assignment.day)} (${dateObj.toLocaleDateString('en-US', { weekday: 'long' })})`;
            const nutrition = nutritionPlans.find(n => isSameDate(n.day, assignment.day));

            return (
              <div key={assignment.assignment_ID} className="d-flex flex-column gap-3 justify-content-between p-2 text-center shadow-sm" style={{ width: '180px' }}>
                <strong>{label}</strong>
                <div className="d-flex flex-column justify-content-center">
                  <Button
                    label="✅ Mark as Done"
                    disabled={assignment.isCompleted}
                    onClick={() => handleMarkDone(assignment)}
                    style={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      padding: '5px 8px',
                      borderRadius: '6px',
                    }}
                  />
                  <Button
                    label="View Plan"
                    className="btn btn-sm mt-2"
                    style={{ backgroundColor: '#fd5c28', color: '#fff', border: 'none' }}
                    onClick={() => handleOpenModal(assignment)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedDay && (
        <>
          <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
              <h4 className={styles.modalTitle}>📆 Plan for {formatDate(selectedDay.day)}</h4>

              {/* Exercises */}
              <section className={styles.sectionBox}>
                <h5>🏋️ Exercises</h5>
                {selectedDay.exercises?.map((ex, i) => (
                  <div key={i}>
                    <strong>{ex.exercise_Name}</strong>
                    <p>{ex.description}</p>
                    {ex.image_url && (
                      <img
                        src={`http://gymmatehealth.runasp.net/images/Exercise/${ex.image_url}`}
                        alt={ex.exercise_Name}
                        className={styles.exerciseImage}
                      />
                    )}
                  </div>
                ))}
              </section>

              {/* Nutrition */}
              {selectedDay.nutrition ? (
                <section className={styles.sectionBox}>
                  <h5>🥗 Nutrition Plan</h5>
                  <ul className={styles.nutritionGrid}>
                    <li><strong>Calories:</strong> {selectedDay.nutrition.calories_Needs}</li>
                    <li><strong>Protein:</strong> {selectedDay.nutrition.protein_Needs}</li>
                    <li><strong>Carbs:</strong> {selectedDay.nutrition.carbs_Needs}</li>
                    <li><strong>Fats:</strong> {selectedDay.nutrition.fats_Needs}</li>
                    <li><strong>1st Meal:</strong> {selectedDay.nutrition.firstMeal}</li>
                    <li><strong>2nd Meal:</strong> {selectedDay.nutrition.secondMeal}</li>
                    <li><strong>3rd Meal:</strong> {selectedDay.nutrition.thirdMeal}</li>
                    <li><strong>4th Meal:</strong> {selectedDay.nutrition.fourthMeal}</li>
                    <li><strong>5th Meal:</strong> {selectedDay.nutrition.fifthMeal}</li>
                    <li><strong>Snacks:</strong> {selectedDay.nutrition.snacks}</li>
                    <li><strong>Vitamins:</strong> {selectedDay.nutrition.vitamins}</li>
                    <li><strong>Notes:</strong> {selectedDay.nutrition.notes}</li>
                  </ul>
                </section>
              ) : (
                <p>No nutrition plan available for this day.</p>
              )}

              <div className="d-flex justify-content-between mt-3">
                <Button label="Close" className="p-button-text" style={{ color: '#fd5c28' }} onClick={() => setShowModal(false)} />
              </div>
            </div>
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingSchedule;
