import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const API_BASE = 'http://gymmatehealth.runasp.net/api';

const SubscriberCalendar = ({ userId, userName }) => {
  const coachId = localStorage.getItem('id');

  const [assignments, setAssignments] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    exerciseId: '',
    notes: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    meals: {
      firstMeal: '',
      secondMeal: '',
      thirdMeal: '',
      fourthMeal: '',
      fifthMeal: '',
      snacks: '',
      vitamins: '',
    },
    nutritionNotes: ''
  });
  const [currentWeek, setCurrentWeek] = useState(0);
  const totalDays = 90; // 3 months, ممكن تعدلها حسب الحاجة

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [assignmentsRes, nutritionRes, exercisesRes] = await Promise.all([
          fetch(`${API_BASE}/Assignments/GetAllUserAssignments/${userId}`),
          fetch(`${API_BASE}/NutritionPlans/GetAllUserNutritionplans/${userId}`),
          fetch(`${API_BASE}/Exercises/GetAllExercises`)
        ]);

        if (assignmentsRes.ok) {
          const data = await assignmentsRes.json();
          setAssignments(data);
        } else if (assignmentsRes.status === 404) {
          setAssignments([]);
        } else {
          throw new Error('Failed to fetch assignments');
        }

        if (nutritionRes.ok) {
          const data = await nutritionRes.json();
          setNutritionPlans(data);
        } else if (nutritionRes.status === 404) {
          setNutritionPlans([]);
        } else {
          throw new Error('Failed to fetch nutrition plans');
        }

        if (exercisesRes.ok) {
          const data = await exercisesRes.json();
          setExercises(data);
        } else {
          throw new Error('Failed to fetch exercises');
        }

        // توليد الأيام
        generateCalendar(totalDays);
      } catch (err) {
        console.error('API error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const generateCalendar = (days) => {
    const today = new Date();
    const list = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const formatted = d.toISOString().split('T')[0]; // YYYY-MM-DD
      list.push({ date: formatted });
    }
    setCalendarDays(list);
  };

  const openModal = (day) => {
    setSelectedDate(day);
    setModalOpen(true);

    const existingAssignment = assignments.find(a => a.day === day);
    const existingNutrition = nutritionPlans.find(n => n.day === day);

    setFormData({
      exerciseId: existingAssignment ? existingAssignment.exercise_ID.toString() : '',
      notes: existingAssignment ? existingAssignment.notes : '',
      calories: existingNutrition ? existingNutrition.calories_Needs : '',
      protein: existingNutrition ? existingNutrition.protein_Needs : '',
      carbs: existingNutrition ? existingNutrition.carbs_Needs : '',
      fats: existingNutrition ? existingNutrition.fats_Needs : '',
      meals: existingNutrition
        ? {
            firstMeal: existingNutrition.firstMeal || '',
            secondMeal: existingNutrition.secondMeal || '',
            thirdMeal: existingNutrition.thirdMeal || '',
            fourthMeal: existingNutrition.fourthMeal || '',
            fifthMeal: existingNutrition.fifthMeal || '',
            snacks: existingNutrition.snacks || '',
            vitamins: existingNutrition.vitamins || '',
          }
        : {
            firstMeal: '',
            secondMeal: '',
            thirdMeal: '',
            fourthMeal: '',
            fifthMeal: '',
            snacks: '',
            vitamins: '',
          },
      nutritionNotes: existingNutrition ? existingNutrition.notes : ''
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/NutritionPlans/AddNutritionPlanForUser`, {
        Coach_ID: coachId,
        User_ID: userId,
        day: selectedDate,
        Calories_Needs: +formData.calories,
        Protein_Needs: +formData.protein,
        Carbs_Needs: +formData.carbs,
        Fats_Needs: +formData.fats,
        firstMeal: formData.meals.firstMeal,
        secondMeal: formData.meals.secondMeal,
        thirdMeal: formData.meals.thirdMeal,
        fourthMeal: formData.meals.fourthMeal,
        fifthMeal: formData.meals.fifthMeal,
        snacks: formData.meals.snacks,
        vitamins: formData.meals.vitamins,
        notes: formData.nutritionNotes
      });

      await axios.post(`${API_BASE}/Assignments/AddNewAssignmentForUser`, {
        coachId,
        userId,
        exerciseId: formData.exerciseId ? parseInt(formData.exerciseId) : null,
        day: selectedDate,
        notes: formData.notes
      });

      alert('Submitted successfully!');
      setModalOpen(false);

      // ممكن هنا تعيد تحميل البيانات لو حابب
    } catch (err) {
      console.error(err);
      alert('Failed to submit.');
    }
  };

  // حساب عدد الأسابيع
  const weeksCount = Math.ceil(calendarDays.length / 7);

  // الأيام المعروضة في الأسبوع الحالي
  const daysToShow = calendarDays.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const renderDayBox = (dayObj) => {
    const hasAssignment = assignments.find(a => a.day === dayObj.date);
    const hasNutrition = nutritionPlans.find(n => n.day === dayObj.date);
    const workoutName = hasAssignment?.exercise?.exercise_Name || null;

    const date = new Date(dayObj.date);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    return (
      <div
        key={dayObj.date}
        className="col-md-3 text-center g-3"
      >
        <div
          className="card p-3 shadow-sm d-flex justify-content-between"
          style={{ width: '90%',height:'200px', minWidth: 220, cursor: 'pointer' }}
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
          <Button variant={hasAssignment || hasNutrition ? 'warning' : 'primary'} size="sm">
            {hasAssignment || hasNutrition ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="py-5 text-center">Loading subscriber calendar...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">{userId ? `Plan for User ${userName}` : 'Subscriber Plan'}</h2>

      <div className="row">
        {daysToShow.map(renderDayBox)}
      </div>

    
<div className="text-center mt-3">
  <div className="mb-2" style={{ fontWeight: 'bold' }}>
    Week {currentWeek + 1} of {weeksCount}
  </div>
  <div className="d-flex justify-content-center gap-3">
    <Button
      variant="warning"
      disabled={currentWeek === 0}
      onClick={() => setCurrentWeek(prev => Math.max(prev - 1, 0))}
      style={{ width: 50 }}
      aria-label="Previous Week"
    >
      &lt;
    </Button>

    <Button
      variant="warning"
      disabled={currentWeek === weeksCount - 1}
      onClick={() => setCurrentWeek(prev => Math.min(prev + 1, weeksCount - 1))}
      style={{ width: 50 }}
      aria-label="Next Week"
    >
      &gt;
    </Button>
  </div>
</div>


      {/* Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Plan for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h6>🏋️ Assignment</h6>
            <Form.Group className="mb-3">
              <Form.Label>Exercise</Form.Label>
              <Form.Select
                value={formData.exerciseId}
                onChange={e => setFormData({ ...formData, exerciseId: e.target.value })}
              >
                <option value="">Select Exercise</option>
                {exercises.map(ex => (
                  <option key={ex.exercise_ID} value={ex.exercise_ID}>
                    {ex.exercise_Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>

            <hr />

            <h6>🥗 Nutrition Plan</h6>

            {['firstMeal', 'secondMeal', 'thirdMeal', 'fourthMeal', 'fifthMeal', 'snacks', 'vitamins'].map(meal => (
              <Form.Group key={meal} className="mb-2">
                <Form.Label>{meal}</Form.Label>
                <Form.Control
                  value={formData.meals[meal]}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      meals: { ...formData.meals, [meal]: e.target.value }
                    })
                  }
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.nutritionNotes}
                onChange={e => setFormData({ ...formData, nutritionNotes: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Calories"
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
              />
              <Form.Control
                type="number"
                placeholder="Protein"
                value={formData.protein}
                onChange={e => setFormData({ ...formData, protein: e.target.value })}
              />
              <Form.Control
                type="number"
                placeholder="Carbs"
                value={formData.carbs}
                onChange={e => setFormData({ ...formData, carbs: e.target.value })}
              />
              <Form.Control
                type="number"
                placeholder="Fats"
                value={formData.fats}
                onChange={e => setFormData({ ...formData, fats: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubscriberCalendar;
