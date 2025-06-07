import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import styles from './TrainingSchedule.module.css';

const TrainingSchedule = () => {
  const [assignments, setAssignments] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const toast = useRef(null);

  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, nutritionRes] = await Promise.all([
          axios.get(`http://gymmatehealth.runasp.net/api/Assignments/GetAllUserAssignments/${userId}`),
          axios.get(`http://gymmatehealth.runasp.net/api/NutritionPlans/GetAllUserNutritionplans/${userId}`)
        ]);

        // Check if assignmentsRes.data is an array or has a "message" property (no data)
        if (Array.isArray(assignmentsRes.data)) {
          setAssignments(assignmentsRes.data.sort((a, b) => new Date(a.day) - new Date(b.day)));
        } else if (assignmentsRes.data?.message) {
          setAssignments([]); // no assignments
          toast.current.show({ severity: 'info', summary: 'No Assignments', detail: assignmentsRes.data.message, life: 4000 });
        }

        // Same for nutrition plans
        if (Array.isArray(nutritionRes.data)) {
          setNutritionPlans(nutritionRes.data);
        } else if (nutritionRes.data?.message) {
          setNutritionPlans([]); // no nutrition plans
          toast.current.show({ severity: 'info', summary: 'No Nutrition Plans', detail: nutritionRes.data.message, life: 4000 });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load training data', life: 4000 });
      }
    };

    fetchData();
  }, [userId]);

  const handleMarkDone = async (assignment) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Assignments/UpdateAssignment/${assignment.assignment_ID}`, {
        ...assignment,
        isCompleted: true,
      });

      setAssignments(prev =>
        prev.map(a => a.assignment_ID === assignment.assignment_ID ? { ...a, isCompleted: true } : a)
      );

      toast.current.show({
        severity: 'success',
        summary: 'Marked as Done',
        detail: `Day ${assignment.day} marked as done!`,
        life: 3000,
      });
    } catch (error) {
      console.error('Failed to mark as done:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to mark assignment as done', life: 3000 });
    }
  };

  const handleOpenModal = (assignment) => {
    const nutrition = nutritionPlans.find(n => n.day === assignment.day);
    setSelectedDay({ ...assignment, nutrition });
    setShowModal(true);
  };

  const handleSaveFeedback = () => {
    console.log('Feedback for', selectedDay.day, feedbackText);
    setShowModal(false);
    setFeedbackText('');
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
            const dateObj = new Date(assignment.day);
            const label = `${dateObj.toLocaleDateString()} (${dateObj.toLocaleDateString('en-US', { weekday: 'long' })})`;

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
              <h4 className={styles.modalTitle}>📆 Plan for {selectedDay.day}</h4>

              {/* Exercise Section */}
              <section className={styles.sectionBox}>
                <h5>🏋️ Exercise Details</h5>
                <p>
                  <strong>Name:</strong>{' '}
                  <a
                    href={`/exercise/${selectedDay.exercise?.exercise_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#fd5c28', textDecoration: 'underline' }}
                  >
                    {selectedDay.exercise?.exercise_Name}
                  </a>
                </p>
                <p><strong>Description:</strong> {selectedDay.exercise?.description}</p>
                <p><strong>Target Muscle:</strong> {selectedDay.exercise?.target_Muscle}</p>
                <p><strong>Calories Burned:</strong> {selectedDay.exercise?.calories_Burned} kcal</p>
                {selectedDay.exercise?.image_gif && (
                  <img
                    src={`http://gymmatehealth.runasp.net/images/Exercise/${selectedDay.exercise.image_gif}`}
                    alt="exercise gif"
                    className={styles.exerciseImage}
                  />
                )}
              </section>

              {/* Nutrition Section */}
              {selectedDay.nutrition ? (
                <section className={styles.sectionBox}>
                  <h5>🥗 Nutrition Plan</h5>
                  <ul className={styles.nutritionGrid}>
                    <li><strong>Calories:</strong> {selectedDay.nutrition.calories_Needs}</li>
                    <li><strong>Protein:</strong> {selectedDay.nutrition.protein_Needs}g</li>
                    <li><strong>Carbs:</strong> {selectedDay.nutrition.carbs_Needs}g</li>
                    <li><strong>Fats:</strong> {selectedDay.nutrition.fats_Needs}g</li>
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

              <div className="mb-3">
                {!selectedDay.isCompleted && (
                  <div className="text-center mb-3">
                    <Button
                      label="✅ Mark this Day as Done"
                      disabled={selectedDay.isCompleted}
                      onClick={() => handleMarkDone(selectedDay)}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                )}
                <label htmlFor="feedbackText" style={{ color: '#fd5c28' }}>Your Feedback</label>
                <InputTextarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-100 mb-3 p-2"
                  placeholder="Provide your feedback on today's session"
                />
              </div>
              <div className="d-flex justify-content-between">
                <Button label="Cancel" className="p-button-text" style={{ color: '#fd5c28' }} onClick={() => setShowModal(false)} />
                <Button label="Submit Feedback" icon="pi pi-check" onClick={handleSaveFeedback} style={{ backgroundColor: '#fd5c28', color: '#fff', border: 'none', padding: '10px' }} />
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
