import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import CalendarDayBox from '../components/CalendarDayBox';
import PlanModal from '../components/PlanModal';
import { formatDateForBackend, isSameDate } from '../../services/date';

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
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(null);
  const [missingPastDays, setMissingPastDays] = useState([]);
  const [missingTomorrow, setMissingTomorrow] = useState(null);

  const [formData, setFormData] = useState({
    selectedCategoryId: null,
    selectedExercises: [],
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

  const totalDays = 90;
  const [currentWeek, setCurrentWeek] = useState(0);

  // ✅ Fetch subscription start date
  useEffect(() => {
    if (!userId) return;
    const fetchSubscriptionStart = async () => {
      try {
        const subRes = await fetch(`${API_BASE}/Subscribes/GetSubscribeByUserId/${userId}`);
        const subs = await subRes.json();
        if (Array.isArray(subs) && subs.length > 0) {
          const [datePart] = subs[0].startDate.split('T'); // "2025-06-18"
          const [year, month, day] = datePart.split('-').map(Number);
          const cleanDate = new Date(Date.UTC(year, month - 1, day)); // UTC-safe date
          setSubscriptionStartDate(cleanDate);
        }
      } catch (error) {
        console.error('Error fetching subscription start:', error);
        setSubscriptionStartDate(null);
      }
    };
    fetchSubscriptionStart();
  }, [userId]);

  // ✅ Generate calendar using UTC-safe logic
  useEffect(() => {
    if (subscriptionStartDate) {
      const [year, month, day] = subscriptionStartDate.toISOString().split('T')[0].split('-').map(Number);
      const list = [];

      for (let i = 0; i < totalDays; i++) {
        const rawDate = new Date(Date.UTC(year, month - 1, day + i));
        const yyyy = rawDate.getUTCFullYear();
        const mm = String(rawDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(rawDate.getUTCDate()).padStart(2, '0');
        list.push({ date: `${yyyy}-${mm}-${dd}` });
      }

      console.log("✅ Calendar starts from:", list[0].date);
      setCalendarDays(list);
    }
  }, [subscriptionStartDate]);

  // Fetch assignments, nutrition, exercises, categories
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
        setAssignments(assignmentsRes.ok ? await assignmentsRes.json() : []);
        setNutritionPlans(nutritionRes.ok ? await nutritionRes.json() : []);
        setExercises(exercisesRes.ok ? await exercisesRes.json() : []);
        setCategories(categoriesRes.ok ? await categoriesRes.json() : []);
      } catch (err) {
        console.error('API error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Detect missing days
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

      const hasAssignment = Array.isArray(assignments) && assignments.some(a => isSameDate(a.day, dayObj.date));
      const hasNutrition = Array.isArray(nutritionPlans) && nutritionPlans.some(n => isSameDate(n.day, dayObj.date));

      if (dayDate < today && (!hasAssignment || !hasNutrition)) {
        missingPast.push(dayObj.date);
      } else if (dayDate.getTime() === tomorrow.getTime() && (!hasAssignment || !hasNutrition)) {
        missingTmrw = dayObj.date;
      }
    });

    setMissingPastDays(missingPast);
    setMissingTomorrow(missingTmrw);
  }, [calendarDays, assignments, nutritionPlans]);

  // Filter exercises by category
  useEffect(() => {
    const filtered = exercises.filter(ex =>
      !formData.selectedCategoryId ||
      ex.category_ID === Number(formData.selectedCategoryId) ||
      formData.selectedExercises.some(sel => sel.value === ex.exercise_ID)
    );
    setFilteredExercises(filtered.map(ex => ({
      label: ex.exercise_Name,
      value: ex.exercise_ID,
      image_url: ex.image_url
    })));
  }, [formData.selectedCategoryId, exercises, formData.selectedExercises]);

  const openModal = (day) => {
    setSelectedDate(day);
    const existingAssignment = assignments.find(a => isSameDate(a.day, day));
    const existingNutrition = nutritionPlans.find(n => isSameDate(n.day, day));

    setFormData({
      selectedCategoryId: existingAssignment?.category_ID || null,
      selectedExercises: existingAssignment?.exercises?.map(ex => ({
        value: ex.exercise_ID,
        label: ex.exercise_Name,
        image_url: ex.image_url
      })) || [],
      notes: existingAssignment?.notes || '',
      calories: existingNutrition?.calories_Needs || '',
      protein: existingNutrition?.protein_Needs || '',
      carbs: existingNutrition?.carbs_Needs || '',
      fats: existingNutrition?.fats_Needs || '',
      meals: {
        firstMeal: existingNutrition?.firstMeal || '',
        secondMeal: existingNutrition?.secondMeal || '',
        thirdMeal: existingNutrition?.thirdMeal || '',
        fourthMeal: existingNutrition?.fourthMeal || '',
        fifthMeal: existingNutrition?.fifthMeal || '',
        snacks: existingNutrition?.snacks || '',
        vitamins: existingNutrition?.vitamins || '',
      },
      nutritionNotes: existingNutrition?.notes || ''
    });

    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const dayFormatted = formatDateForBackend(selectedDate);

      await axios.post(`${API_BASE}/NutritionPlans/AddNutritionPlanForUser`, {
        Coach_ID: coachId,
        User_ID: userId,
        day: dayFormatted,
        Calories_Needs: +formData.calories,
        Protein_Needs: +formData.protein,
        Carbs_Needs: +formData.carbs,
        Fats_Needs: +formData.fats,
        ...formData.meals,
        notes: formData.nutritionNotes
      });

      const assignmentsPayload = {
        userId,
        coachId,
        assignments: [{
          day: selectedDate,
          notes: formData.notes,
          exerciseIds: formData.selectedExercises.map(ex => ex.value)
        }]
      };

      await axios.post(`${API_BASE}/Assignments/AddNewAssignmentsForUser`, assignmentsPayload);

      const newAssignment = {
        day: selectedDate,
        notes: formData.notes,
        exercises: formData.selectedExercises.map(ex => ({
          exercise_ID: ex.value,
          exercise_Name: ex.label,
          image_url: ex.image_url
        }))
      };

      const newNutrition = {
        day: selectedDate,
        calories_Needs: +formData.calories,
        protein_Needs: +formData.protein,
        carbs_Needs: +formData.carbs,
        fats_Needs: +formData.fats,
        ...formData.meals,
        notes: formData.nutritionNotes
      };

      setAssignments(prev => [
        ...(Array.isArray(prev) ? prev.filter(a => !isSameDate(a.day, selectedDate)) : []),
        newAssignment
      ]);

      setNutritionPlans(prev => [
        ...(Array.isArray(prev) ? prev.filter(n => !isSameDate(n.day, selectedDate)) : []),
        newNutrition
      ]);

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Submitted successfully!',
        life: 3000
      });

      setModalOpen(false);
    } catch (err) {
      console.error('Submission error:', err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to submit.',
        life: 3000
      });
    }
  };

  const weeksCount = Math.ceil(calendarDays.length / 7);
  const daysToShow = calendarDays.slice(currentWeek * 7, (currentWeek + 1) * 7);

  if (loading) return <div className="py-5 text-center">Loading subscriber calendar...</div>;

  return (
    <div className="container py-4">
      <Toast ref={toast} />

      {missingPastDays.length > 0 && (
        <div className="alert alert-danger">
          ⚠️ Missing past plans: {missingPastDays.join(', ')}
        </div>
      )}

      {missingTomorrow && (
        <div className="alert alert-warning">
          ⚠️ Tomorrow ({missingTomorrow}) is missing plans.
        </div>
      )}

      <h2 className="mb-4">{userId ? `Plan for ${userName}` : 'Subscriber Plan'}</h2>

      <div className="row">
        {daysToShow.map(day => (
          <CalendarDayBox
            key={day.date}
            dayObj={day}
            assignments={assignments}
            nutritionPlans={nutritionPlans}
            openModal={openModal}
            isSameDate={isSameDate}
          />
        ))}
      </div>

      <div className="text-center mt-3">
        <div className="mb-2 fw-bold">Week {currentWeek + 1} of {weeksCount}</div>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="warning" disabled={currentWeek === 0} onClick={() => setCurrentWeek(prev => prev - 1)}>&lt;</Button>
          <Button variant="warning" disabled={currentWeek === weeksCount - 1} onClick={() => setCurrentWeek(prev => prev + 1)}>&gt;</Button>
        </div>
      </div>

     <PlanModal
  show={modalOpen}
  onHide={() => setModalOpen(false)}
  onSubmit={handleSubmit}
  formData={formData}
  setFormData={setFormData}
  categories={categories}
  filteredExercises={filteredExercises}
  selectedDate={selectedDate}
  assignments={assignments}
  nutritionPlans={nutritionPlans}
  isSameDate={isSameDate}
/>

    </div>
  );
};

export default SubscriberCalendar;
