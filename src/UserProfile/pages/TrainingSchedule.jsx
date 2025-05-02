import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

const TOTAL_DAYS = 30;

const TrainingSchedule = () => {
  const user = {
    id: "user123",
    startDate: "2025-01-01",
    endDate: "2025-01-30",
    trainingPlan: {
      "2025-01-01": { mode: "Cardio", workout: "Running", diet: "High protein breakfast" },
      "2025-01-02": { mode: "Weights", workout: "Squats", diet: "Oats and fruits" },
      // Add all 30 days training plan here
    },
  };

  const [completedDays, setCompletedDays] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const toast = useRef(null);

  const handleMarkDone = (date) => {
    setCompletedDays((prev) => ({ ...prev, [date]: true }));

    // Show toast notification when Mark as Done is clicked
    toast.current.show({ severity: 'success', summary: 'Success', detail: `Day ${date} marked as done!`, life: 3000 });
  };

  const handleOpenModal = (date) => {
    setSelectedDay(date);
    setShowModal(true);
  };

  const handleSaveFeedback = () => {
    console.log('Feedback for', selectedDay, feedbackText);
    setShowModal(false);
    setFeedbackText('');
  };

  const generateDays = () => {
    const startDate = new Date(user.startDate);
    const endDate = new Date(user.endDate);
    const days = [];

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      days.push({
        date: day.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
        label: `${day.toLocaleDateString()} (${day.toLocaleDateString('en-US', { weekday: 'long' })})`,
      });
    }

    return days;
  };

  const days = generateDays();

  return (
    <div className="container py-4">
      <Toast ref={toast} /> {/* Toast component */}
      <h3 className="mb-3" style={{ color: '#fd5c28', fontFamily: 'Poppins, sans-serif' }}>📅 Your Training Schedule</h3>

      {/* Display the calendar */}
      <div className="d-flex flex-wrap gap-3">
        {days.map((day, index) => (
          <div key={index} className="card p-2 text-center shadow-sm" style={{ width: '180px' }}>
            <strong>{day.label}</strong>
            <Button
              label="Mark as Done"
              className="btn btn-sm mt-2"
              style={{
                backgroundColor: '#fd5c28',
                color: '#fff',
                border: 'none',
                marginBottom: '8px',
                padding: '8px',
              }}
              onClick={() => handleMarkDone(day.date)}
              disabled={completedDays[day.date]}
            />
            <Button
              label="View Plan"
              className="btn btn-sm mt-2"
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '8px',
              }}
              onClick={() => handleOpenModal(day.date)}
            />
          </div>
        ))}
      </div>

      {/* Modal to view and provide feedback for the selected day */}
      {showModal && (
        <div
          className="custom-modal"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
            zIndex: '1000',
            width: '500px',
          }}
        >
          <div style={{ marginBottom: '15px', fontSize: '1.25rem', color: '#fd5c28' }}>
            <strong>Training and Diet Plan for {selectedDay}</strong>
          </div>
          <div>
            <h5>Training Plan</h5>
            <p>{user.trainingPlan[selectedDay]?.workout || 'No training plan available for this day.'}</p>
            <h5>Diet Plan</h5>
            <p>{user.trainingPlan[selectedDay]?.diet || 'No diet plan available for this day.'}</p>
          </div>
          <div className="mb-3">
            <label htmlFor="feedbackText" style={{ color: '#fd5c28' }}>Your Feedback</label>
            <InputTextarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="w-100 mb-3 ps-2"
              placeholder="Provide your feedback on today's session"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #fd5c28',
                borderRadius: '8px',
                padding: '10px',
                color: '#000',
              }}
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              label="Cancel"
              className="p-button-text"
              style={{ color: '#fd5c28' }}
              onClick={() => setShowModal(false)}
            />
            <Button
              label="Submit Feedback"
              icon="pi pi-check"
              onClick={handleSaveFeedback}
              className="btn btn-primary"
              style={{
                backgroundColor: '#fd5c28',
                color: '#fff',
                border: 'none',
                padding: '10px',
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '999',
          }}
          onClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TrainingSchedule;
