import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const TOTAL_WEEKS = 12;
const DAYS_PER_WEEK = 3;
const TOTAL_DAYS = TOTAL_WEEKS * DAYS_PER_WEEK;

const TrainingSchedule = () => {
  const [completedDays, setCompletedDays] = useState({});
  const [feedbackWeek, setFeedbackWeek] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user_training_schedule');
    if (stored) setCompletedDays(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('user_training_schedule', JSON.stringify(completedDays));
  }, [completedDays]);

  const toggleDay = (weekIndex, day) => {
    setCompletedDays((prev) => {
      const week = prev[weekIndex] || [];
      const newWeek = week.includes(day) ? week.filter((d) => d !== day) : [...week, day];
      return { ...prev, [weekIndex]: newWeek };
    });
  };

  const isWeekVisible = (index) => {
    if (index === 0) return true;
    const prev = completedDays[index - 1] || [];
    return prev.length === DAYS_PER_WEEK;
  };

  const getProgress = () => {
    let total = 0;
    Object.values(completedDays).forEach((week) => {
      total += week.length;
    });
    return Math.floor((total / TOTAL_DAYS) * 100);
  };

  const handleFeedback = (weekIndex) => {
    setFeedbackWeek(weekIndex);
    setShowModal(true);
  };

  const saveFeedback = () => {
    console.log(`Feedback for week ${feedbackWeek + 1}:`, feedbackText);
    setFeedbackText('');
    setShowModal(false);
  };

  const weeks = Array.from({ length: TOTAL_WEEKS });

  const groupWeeksInRows = () => {
    return weeks.reduce((rows, _, index) => {
      if (index % 3 === 0) rows.push([]);
      rows[rows.length - 1].push(index);
      return rows;
    }, []);
  };

  return (
    <div className="container">
      <h3 className="mb-3" style={{ color: '#fd5c28' }}>📅 Your Training Schedule</h3>

      {/* Progress Bar */}
      <div className="progress mb-4" style={{ height: '20px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${getProgress()}%`, backgroundColor: '#fd5c28' }}
        >
          {getProgress()}%
        </div>
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {groupWeeksInRows().map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex gap-3 mb-4">
            {row.map((weekIndex) => {
              const days = completedDays[weekIndex] || [];
              const isEnabled = isWeekVisible(weekIndex);
              const isCompleted = days.length === DAYS_PER_WEEK;

              return (
                <div
                  key={weekIndex}
                  className="border rounded shadow-sm p-3 flex-fill"
                  style={{ minWidth: '220px', background: isEnabled ? '#fff' : '#f1f1f1', opacity: isEnabled ? 1 : 0.5 }}
                >
                  <h6 className="mb-2 fw-bold">Week {weekIndex + 1}</h6>

                  <div className="d-flex flex-column gap-2">
                    {[1, 2, 3].map((day) => (
                      <button
                        key={day}
                        disabled={!isEnabled}
                        className={`btn btn-sm text-start ${days.includes(day) ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => toggleDay(weekIndex, day)}
                      >
                        ✅ Day {day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 text-muted small">
                    Completed: {days.length}/{DAYS_PER_WEEK}
                  </div>

                  {/* Motivation */}
                  {isCompleted && (
                    <div className="alert alert-success mt-3 py-2 small text-center">
                      🎉 Great job this week!
                    </div>
                  )}

                  {/* Feedback Button */}
                  {isCompleted && (
                    <Button
                      label="Give Feedback"
                      className="btn btn-warning btn-sm w-100 mt-2"
                      onClick={() => handleFeedback(weekIndex)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      <Dialog
        header={`  Feedback – Week ${feedbackWeek + 1}`}
        visible={showModal}
        style={{ width: '400px' }}
        onHide={() => setShowModal(false)}
        >
  <div style={{ padding: '1rem' }}>
    <p className="mb-3">How was your training experience this week?</p>
    <InputTextarea
      value={feedbackText}
      onChange={(e) => setFeedbackText(e.target.value)}
      rows={4}
      className="w-100 mb-3 ps-2"
      placeholder="Your comments..."
    />
    <div className="text-end">
      <Button label="Submit" icon="pi pi-check" onClick={saveFeedback} className="btn btn-primary" />
    </div>
  </div>
</Dialog>

    </div>
  );
};

export default TrainingSchedule;
