import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { Toast } from 'primereact/toast';

const API_BASE = 'http://gymmatehealth.runasp.net/api';

const SubscriberCalendar = ({ userId, userName }) => {
  const coachId = localStorage.getItem('id');
  const toast = useRef(null);
  const [assignments, setAssignments] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    selectedCategoryId: null,
    selectedExercises: [],    // react-select: array of {value,label}
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
  const totalDays = 90; // 3 months, adjust as needed

  const [subscriptionStartDate, setSubscriptionStartDate] = useState(null);
  const [missingPastDays, setMissingPastDays] = useState([]);
  const [missingTomorrow, setMissingTomorrow] = useState(null);

  // Format date to dd-MM-yyyy as required by backend
  const formatDateForBackend = (isoDateString) => {
    const d = new Date(isoDateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch subscription startDate
  useEffect(() => {
    if (!userId) return;

    const fetchSubscriptionStart = async () => {
      try {
        const subRes = await fetch(`${API_BASE}/Subscribes/GetSubscribeByUserId/${userId}`);
        if (!subRes.ok) throw new Error('Failed to fetch subscription');
        const subs = await subRes.json();
        if (Array.isArray(subs) && subs.length > 0) {
          setSubscriptionStartDate(new Date(subs[0].startDate));
        } else {
          setSubscriptionStartDate(null);
        }
      } catch (error) {
        console.error('Subscription fetch error:', error);
        setSubscriptionStartDate(null);
      }
    };

    fetchSubscriptionStart();
  }, [userId]);

  // Fetch assignments, nutrition plans, exercises, categories
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [assignmentsRes, nutritionRes, exercisesRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/Assignments/GetAllUserAssignments/${userId}`),
          fetch(`${API_BASE}/NutritionPlans/GetAllUserNutritionplans/${userId}`),
          fetch(`${API_BASE}/Exercises/GetAllExercises`),
          fetch(`${API_BASE}/Categories/GetAllCategories`)
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

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (err) {
        console.error('API error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Generate calendar when subscriptionStartDate changes
  useEffect(() => {
    if (subscriptionStartDate) {
      generateCalendar(totalDays, subscriptionStartDate);
    }
  }, [subscriptionStartDate]);

  // Generate calendar days from startDate
  const generateCalendar = (days, startDate) => {
    const list = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const formatted = d.toISOString().split('T')[0]; // YYYY-MM-DD
      list.push({ date: formatted });
    }
    setCalendarDays(list);
  };

  // Check missing plans for past days and tomorrow
  useEffect(() => {
    if (calendarDays.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const missingPast = [];
    let missingTmrw = null;

    calendarDays.forEach(dayObj => {
      const dayDate = new Date(dayObj.date);
      dayDate.setHours(0, 0, 0, 0);

      const hasAssignment = assignments.some(a => a.day === dayObj.date);
      const hasNutrition = nutritionPlans.some(n => n.day === dayObj.date);

      if (dayDate < today) {
        if (!hasAssignment || !hasNutrition) {
          missingPast.push(dayObj.date);
        }
      } else if (dayDate.getTime() === tomorrow.getTime()) {
        if (!hasAssignment || !hasNutrition) {
          missingTmrw = dayObj.date;
        }
      }
    });

    setMissingPastDays(missingPast);
    setMissingTomorrow(missingTmrw);
  }, [calendarDays, assignments, nutritionPlans]);

  // When category changes, filter exercises for that category
  useEffect(() => {
    if (formData.selectedCategoryId) {
      const filtered = exercises.filter(ex => ex.category_ID === Number(formData.selectedCategoryId));
      setFilteredExercises(filtered.map(ex => ({
        label: ex.exercise_Name,
        value: ex.exercise_ID,
        image_url: ex.image_url
      })));
      setFormData(prev => ({ ...prev, selectedExercises: [] }));
    } else {
      setFilteredExercises([]);
      setFormData(prev => ({ ...prev, selectedExercises: [] }));
    }
  }, [formData.selectedCategoryId, exercises]);

  const openModal = (day) => {
    setSelectedDate(day);

    const existingAssignment = Array.isArray(assignments) ? assignments.find(a => a.day === day) : undefined;
    const existingNutrition = Array.isArray(nutritionPlans) ? nutritionPlans.find(n => n.day === day) : undefined;

    let preSelectedExercises = [];
    if (existingAssignment) {
      preSelectedExercises = existingAssignment.exercise_ID ? [{ value: existingAssignment.exercise_ID, label: '' }] : [];
    }

    setFormData({
      selectedCategoryId: existingAssignment ? existingAssignment.category_ID : null,
      selectedExercises: preSelectedExercises,
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

    setModalOpen(true);
  };

  // Submit form data with fixed payloads and date format
 const handleSubmit = async () => {
    try {
      const dayFormatted = formatDateForBackend(selectedDate);

      const res= await axios.post(`${API_BASE}/NutritionPlans/AddNutritionPlanForUser`, {
        Coach_ID: coachId,
        User_ID: userId,
        day: dayFormatted,
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
      console.log("naituration",res);
      
      const exerciseIds = formData.selectedExercises.map(ex => ex.value);

      const assignmentRes = await axios.post(`${API_BASE}/Assignments/AddNewAssignmentForUser`, {
        coachId,
        userId,
        exerciseIds,  // Assuming backend supports array of exerciseIds
        day: dayFormatted,
        notes: formData.notes
      });

      console.log('Assignments response:', assignmentRes.data);

      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Submitted successfully!', life: 3000 });
      setModalOpen(false);

    } catch (err) {
      console.error('Submission error:', err);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to submit.', life: 3000 });
    }
  };


  const weeksCount = Math.ceil(calendarDays.length / 7);
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
        <Toast ref={toast} />
        <div
          className="card p-3 shadow-sm d-flex justify-content-between"
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
      {/* Missing plans alerts */}
      {missingPastDays.length > 0 && (
        <div className="alert alert-danger mb-3" role="alert">
          ⚠️ You have <strong>{missingPastDays.length}</strong> past day(s) missing plans: {missingPastDays.join(', ')}. Please update them!
        </div>
      )}
      {missingTomorrow && (
        <div className="alert alert-warning mb-3" role="alert">
          ⚠️ Tomorrow ({missingTomorrow}) is missing plans. Please prepare it in advance!
        </div>
      )}

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

            {/* Category select */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.selectedCategoryId || ''}
                onChange={e => setFormData({ ...formData, selectedCategoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.category_ID} value={cat.category_ID}>
                    {cat.category_Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Exercises MultiSelect with react-select */}
            <Form.Group className="mb-3">
              <Form.Label>Exercises</Form.Label>
              <Select
                isMulti
                options={filteredExercises}
                value={formData.selectedExercises}
                onChange={(selected) => setFormData({ ...formData, selectedExercises: selected || [] })}
                placeholder="Select exercises"
                className="basic-multi-select"
                classNamePrefix="select"
                formatOptionLabel={option => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      src={`http://gymmatehealth.runasp.net/images/Exercise/${option.image_url}`}
                      alt={option.label}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <span>{option.label}</span>
                  </div>
                )}
              />
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
