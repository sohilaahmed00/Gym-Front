import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../config';

// تعريف متغيرات API

const API_ENDPOINTS = {
  GET_CATEGORY: (id) => `${API_BASE_URL}/Categories/GetCategory/${id}`,
  GET_EXERCISES_BY_CATEGORY: (id) => `${API_BASE_URL}/Exercises/GetByCategoryId/${id}`,
  GET_ALL_EXERCISES: `${API_BASE_URL}/Exercises/GetAllExercises`,
  ADD_EXERCISE: `${API_BASE_URL}/Exercises/AddExercise`,
  UPDATE_EXERCISE: `${API_BASE_URL}/Exercises/UpdateExercise`,
  DELETE_EXERCISE: (id) => `${API_BASE_URL}/Exercises/DeleteExercise/${id}`
};

// إضافة interceptor للتحقق من الاستجابات
axios.interceptors.response.use(
  response => {
    console.log('استجابة API:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('خطأ في طلب API:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// قالب تمرين جديد فارغ
const EMPTY_EXERCISE = {
  exercise_ID: 0,
  exercise_Name: "",
  description: "",
  image_url: "",
  image_gif: "",
  duration: 30,
  target_Muscle: "",
  difficulty_Level: 2,
  calories_Burned: 0,
  category_ID: 0,
  category: null
};

const DIFFICULTY_LEVELS = [
  { value: "مبتدئ", color: "success" },
  { value: "متوسط", color: "warning" },
  { value: "متقدم", color: "danger" }
];

const ADExercises = () => {
  // استخراج معرف القسم من الرابط
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [category, setCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ ...EMPTY_EXERCISE, category_ID: parseInt(categoryId) });
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Image Preview State
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState('');

  // Video Preview State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoName, setSelectedVideoName] = useState('');

  // New Exercise Image and GIF state
  const [newExerciseImage, setNewExerciseImage] = useState(null);
  const [newExerciseGif, setNewExerciseGif] = useState(null);
  const [editExerciseImage, setEditExerciseImage] = useState(null);
  const [editExerciseGif, setEditExerciseGif] = useState(null);

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // إخفاء التنبيه تلقائيًا بعد 3 ثوان
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // عرض الصورة في النافذة المنبثقة
  const handleShowImage = (imageUrl, exerciseName) => {
    if (!imageUrl) return;
    
    setSelectedImage(imageUrl);
    setSelectedExerciseName(exerciseName);
    setShowImageModal(true);
  };

  // عرض الجيف في النافذة المنبثقة
  const handleShowGif = (gifUrl, exerciseName) => {
    if (!gifUrl) return;
    
    setSelectedImage(gifUrl);
    setSelectedExerciseName(exerciseName);
    setShowImageModal(true);
  };

  // Function to get correct image URL
  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return null;
    
    // محاولة استخدام مسارات متعددة للصور
    try {
      // مسار 1: مجلد الصور الكامل
      return `${API_BASE_IMAGE_URL}/Images/${imageFileName}`;
    } catch (err) {
      console.error('خطأ في تحميل الصورة:', err);
      return null;
    }
  };

  // Fetch exercises and category data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب معلومات القسم
      const categoryResponse = await axios.get(`${API_BASE_URL}/Categories/GetCategory/${categoryId}`);
      const categoryData = categoryResponse.data;
      
      // إضافة وصف للقسم إذا لم يكن موجودا
      if (!categoryData.description) {
        categoryData.description = 'لا يوجد وصف متاح لهذا القسم';
      }
      
      setCategory(categoryData);
      
      // جلب جميع التمارين
      const exercisesResponse = await axios.get(`${API_BASE_URL}/Exercises/GetExercisesByCategory/${categoryId}`);
      console.log('تمارين API:', exercisesResponse.data);
      
      if (Array.isArray(exercisesResponse.data)) {
        setExercises(exercisesResponse.data);
      } else {
        console.error('البيانات المستلمة ليست مصفوفة:', exercisesResponse.data);
        setExercises([]);
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setError('حدث خطأ أثناء جلب البيانات');
      showAlert('حدث خطأ أثناء جلب البيانات', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // دالة لإرجاع وصف افتراضي للأقسام
  const getCategoryDescription = (categoryName) => {
    const descriptions = {
      "Chest": "تمارين لتقوية وبناء عضلات الصدر",
      "Back": "تمارين لتقوية عضلات الظهر والحفاظ على استقامة العمود الفقري",
      "Shoulders": "تمارين لتقوية وتحسين شكل عضلات الكتفين",
      "Biceps": "تمارين لتقوية وتضخيم عضلات الذراعين الأمامية",
      "Triceps": "تمارين متنوعة لعضلات الذراعين الخلفية",
      "Wrist & Forearm": "تمارين لتقوية عضلات المعصم والساعد",
      "Legs": "تمارين متكاملة لعضلات الأرجل والفخذين",
      "Abs": "تمارين متنوعة لعضلات البطن وتقوية عضلات المركز"
    };
    
    return descriptions[categoryName] || "مجموعة متنوعة من التمارين الرياضية";
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // Delete exercise function
  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التمرين؟')) {
      try {
        setDeletingId(exerciseId);
        const response = await axios.delete(API_ENDPOINTS.DELETE_EXERCISE(exerciseId));
        
        if (response.status === 200) {
          // تحديث قائمة التمارين
          setExercises(exercises.filter(ex => ex.exercise_ID !== exerciseId));
          showAlert('تم حذف التمرين بنجاح', 'success');
        } else {
          throw new Error('فشل في حذف التمرين');
        }
      } catch (err) {
        showAlert('حدث خطأ أثناء حذف التمرين', 'danger');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Start adding exercise
  const handleStartAddExercise = () => {
    setIsAddingExercise(true);
    setNewExercise({ ...EMPTY_EXERCISE, category_ID: parseInt(categoryId) });
  };

  // Cancel adding exercise
  const handleCancelAddExercise = () => {
    setIsAddingExercise(false);
  };
  
  // Handle input change in add form
  const handleAddExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value
    });
  };

  // Submit new exercise
  const handleSubmitNewExercise = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(newExercise).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (newExerciseImage) {
        formData.append('image', newExerciseImage);
      }
      if (newExerciseGif) {
        formData.append('gif', newExerciseGif);
      }
      const response = await axios.post(API_ENDPOINTS.ADD_EXERCISE, formData);
      if (response.status === 201 || response.status === 200) {
        await fetchData();
        setIsAddingExercise(false);
        showAlert('تم إضافة التمرين بنجاح', 'success');
      } else {
        throw new Error('فشل في إضافة التمرين');
      }
    } catch (err) {
      showAlert('حدث خطأ أثناء إضافة التمرين', 'danger');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing exercise
  const handleEditClick = (exercise) => {
    setEditingExercise({ ...exercise });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingExercise(null);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingExercise({
      ...editingExercise,
      [name]: value
    });
  };

  // Submit updated exercise
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(editingExercise).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (editExerciseImage) {
        formData.append('image', editExerciseImage);
      }
      if (editExerciseGif) {
        formData.append('gif', editExerciseGif);
      }
      const response = await axios.put(API_ENDPOINTS.UPDATE_EXERCISE, formData);
      if (response.status === 200) {
        await fetchData();
        setEditingExercise(null);
        showAlert('تم تحديث التمرين بنجاح', 'success');
      } else {
        throw new Error('فشل في تحديث التمرين');
      }
    } catch (err) {
      showAlert('حدث خطأ أثناء تحديث التمرين', 'danger');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter exercises based on search term and difficulty
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = 
      ex.exercise_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ex.target_Muscle && ex.target_Muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = !difficultyFilter || ex.difficulty_Level === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  // Get difficulty badge
  const getDifficultyBadge = (difficulty) => {
    const difficultyLevel = DIFFICULTY_LEVELS.find(level => level.value === difficulty);
    return difficultyLevel ? difficultyLevel.color : 'secondary';
  };

  // Go back to categories
  const handleGoBack = () => {
    navigate('/admin/exercise-categories');
  };

  const isCardView = true; // لتفعيل عرض الكاردات مع أزرار التعديل والحذف

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid py-4">
      {/* Alert Component */}
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show mt-2 mb-3`} role="alert">
          <div className="d-flex align-items-center">
            {alert.type === 'success' ? (
              <i className="fas fa-check-circle me-2"></i>
            ) : alert.type === 'danger' ? (
              <i className="fas fa-exclamation-circle me-2"></i>
            ) : (
              <i className="fas fa-info-circle me-2"></i>
            )}
            <strong>{alert.message}</strong>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlert({ ...alert, show: false })}
            aria-label="إغلاق"
          ></button>
        </div>
      )}

      {/* Back Button & Category Title */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-sm btn-outline-secondary me-3" 
          onClick={handleGoBack}
        >
          <i className="fas fa-arrow-right me-1"></i>
          العودة للأقسام
        </button>
        {category && (
          <div>
            <h3 className="fw-bold mb-0">
              تمارين قسم: {category.category_Name}
            </h3>
            <p className="text-muted mb-0 small">{category.description}</p>
          </div>
        )}
      </div>
      
      {isAddingExercise ? (
        // Add Exercise Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">إضافة تمرين جديد</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelAddExercise}>
                <i className="fas fa-times me-2"></i>
                إلغاء
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewExercise}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">اسم التمرين</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="exercise_Name" 
                    value={newExercise.exercise_Name} 
                    onChange={handleAddExerciseInputChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">مستوى الصعوبة</label>
                  <select 
                    className="form-select" 
                    name="difficulty_Level" 
                    value={newExercise.difficulty_Level || 'متوسط'} 
                    onChange={handleAddExerciseInputChange}
                    required
                  >
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.value}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">العضلات المستهدفة</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="target_Muscle" 
                  value={newExercise.target_Muscle} 
                  onChange={handleAddExerciseInputChange}
                  placeholder="مثال: عضلات الصدر، عضلات البطن..."
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">صورة التمرين</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={e => setNewExerciseImage(e.target.files[0])}
                    required
                  />
                  <small className="text-muted">اختر صورة التمرين</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">ملف GIF (اختياري)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/gif"
                    onChange={e => setNewExerciseGif(e.target.files[0])}
                  />
                  <small className="text-muted">اختر ملف GIF إذا توفر</small>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">وصف التمرين</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={newExercise.description} 
                  onChange={handleAddExerciseInputChange}
                  rows="4"
                ></textarea>
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      جارٍ الإضافة...
                    </>
                  ) : 'إضافة التمرين'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : editingExercise ? (
        // Edit Exercise Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">تعديل التمرين</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times me-2"></i>
                إلغاء
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">اسم التمرين</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="exercise_Name" 
                    value={editingExercise.exercise_Name || ''} 
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">مستوى الصعوبة</label>
                  <select 
                    className="form-select" 
                    name="difficulty_Level" 
                    value={editingExercise.difficulty_Level || 'متوسط'} 
                    onChange={handleInputChange}
                    required
                  >
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.value}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">العضلات المستهدفة</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="target_Muscle" 
                  value={editingExercise.target_Muscle || ''} 
                  onChange={handleInputChange}
                  placeholder="مثال: عضلات الصدر، عضلات البطن..."
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">صورة التمرين</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={e => setEditExerciseImage(e.target.files[0])}
                  />
                  <small className="text-muted">اختر صورة جديدة إذا أردت تغيير الصورة الحالية</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">ملف GIF (اختياري)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/gif"
                    onChange={e => setEditExerciseGif(e.target.files[0])}
                  />
                  <small className="text-muted">اختر ملف GIF جديد إذا أردت تغيير الجيف الحالي</small>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">وصف التمرين</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={editingExercise.description || ''} 
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      جارٍ الحفظ...
                    </>
                  ) : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Exercises List
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">قائمة التمارين</h4>
              <button className="btn btn-primary" onClick={handleStartAddExercise}>
                <i className="fas fa-plus me-2"></i>
                إضافة تمرين جديد
              </button>
            </div>

            {/* Filters Section */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="بحث عن تمارين..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="">جميع المستويات</option>
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.value}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Section */}
            {isCardView ? (
              <div className="row">
                {filteredExercises.map((exercise) => (
                  <div className="col-md-4 col-lg-3 mb-4" key={exercise.exercise_ID}>
                    <div className="card h-100 shadow-sm">
                      {exercise.image_url && (
                        <img
                          src={getImageUrl(exercise.image_url)}
                          alt={exercise.exercise_Name}
                          className="card-img-top"
                          style={{ height: 200, objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => handleShowImage(getImageUrl(exercise.image_url), exercise.exercise_Name)}
                        />
                      )}
                      <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: 220 }}>
                        <div>
                          <h5 className="card-title">{exercise.exercise_Name}</h5>
                          <p className="card-text mb-1"><b>Target:</b> {exercise.target_Muscle || 'غير محدد'}</p>
                          <p className="card-text mb-1"><b>Duration:</b> {exercise.duration} ثانية</p>
                          <p className="card-text mb-2"><b>Calories:</b> {exercise.calories_Burned} سعرة</p>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-primary w-50" 
                            onClick={() => handleEditClick(exercise)}
                            style={{ backgroundColor: '#ff7a00', borderColor: '#ff7a00' }}
                          >
                            <i className="fas fa-edit me-1"></i> تعديل
                          </button>
                          <button 
                            className="btn btn-sm btn-danger w-50" 
                            onClick={() => handleDeleteExercise(exercise.exercise_ID)} 
                            disabled={deletingId === exercise.exercise_ID}
                          >
                            {deletingId === exercise.exercise_ID ? (
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            ) : <i className="fas fa-trash me-1"></i>}
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 text-start">التمرين</th>
                      <th className="border-0">الوصف</th>
                      <th className="border-0">العضلات المستهدفة</th>
                      <th className="border-0">المستوى</th>
                      <th className="border-0">المدة</th>
                      <th className="border-0">السعرات</th>
                      <th className="border-0">الوسائط</th>
                      <th className="border-0">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.map((exercise) => (
                      <tr key={exercise.exercise_ID} className="exercise-row">
                        <td className="text-start">
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                            {exercise.image_url ? (
                              <div 
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  border: '1px solid #dee2e6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#f8f9fa'
                                }}
                                onClick={() => handleShowImage(getImageUrl(exercise.image_url), exercise.exercise_Name)}
                                title="انقر لتكبير الصورة"
                              >
                                <img 
                                  src={getImageUrl(exercise.image_url)} 
                                  alt={exercise.exercise_Name}
                                  onError={(e) => {
                                    console.log('خطأ في تحميل الصورة:', exercise.image_url);
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/60?text=صورة";
                                  }}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 60,
                                borderRadius: '8px',
                                background: '#0d6efd22',
                                color: '#0d6efd',
                                fontSize: 20,
                              }}>
                                <i className="fas fa-dumbbell"></i>
                              </span>
                            )}
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{exercise.exercise_Name}</span>
                          </span>
                        </td>
                        <td>
                          <span className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {exercise.description}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {exercise.target_Muscle || "غير محدد"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getDifficultyBadge(exercise.difficulty_Level)}`}>
                            {exercise.difficulty_Level === 1 ? 'مبتدئ' : 
                             exercise.difficulty_Level === 2 ? 'متوسط' : 
                             exercise.difficulty_Level === 3 ? 'متقدم' : 'غير محدد'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {exercise.duration} دقيقة
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning">
                            {exercise.calories_Burned} سعرة
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {exercise.image_url && (
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleShowImage(getImageUrl(exercise.image_url), exercise.exercise_Name)}
                                title="عرض الصورة"
                              >
                                <i className="fas fa-image"></i>
                              </button>
                            )}
                            {exercise.image_gif && (
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleShowGif(getImageUrl(exercise.image_gif), exercise.exercise_Name)}
                                title="عرض الجيف"
                              >
                                <i className="fas fa-film"></i>
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditClick(exercise)}
                            >
                              <i className="fas fa-edit me-1"></i>
                              تعديل
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteExercise(exercise.exercise_ID)}
                              disabled={deletingId === exercise.exercise_ID}
                            >
                              {deletingId === exercise.exercise_ID ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  جارٍ الحذف...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-trash me-1"></i>
                                  حذف
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredExercises.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-dumbbell text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="text-muted">لا توجد تمارين للعرض</h5>
                <p className="text-muted">قم بإضافة تمارين جديدة لهذا القسم</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)} 
        centered 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedExerciseName || 'صورة التمرين'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedImage && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px'
            }}>
              <img 
                src={selectedImage} 
                alt="صورة التمرين" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=صورة+غير+متوفرة";
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Video Preview Modal */}
      <Modal 
        show={showVideoModal} 
        onHide={() => setShowVideoModal(false)} 
        centered 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedVideoName || 'فيديو التمرين'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedVideo && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px'
            }}>
              <iframe
                width="100%"
                height="400"
                src={selectedVideo.replace('watch?v=', 'embed/')}
                title="فيديو التمرين"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .exercise-row:hover { 
          background: #f8f9fa; 
          transition: all 0.2s ease;
        }
        .badge {
          font-weight: 500;
          padding: 6px 10px;
        }
        .table th {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-group .btn {
          padding: 0.4rem 0.8rem;
        }
        .form-select, .form-control {
          border-radius: 8px;
          border: 1px solid #dee2e6;
          padding: 0.5rem 1rem;
          font-size: 14px;
        }
        .form-select:focus, .form-control:focus {
          border-color: #ff7a00;
          box-shadow: 0 0 0 0.2rem rgba(255, 122, 0, 0.25);
        }
        .btn-primary, .bg-primary {
          background-color: #ff7a00 !important;
          border-color: #ff7a00 !important;
        }
        .btn-outline-primary {
          color: #ff7a00 !important;
          border-color: #ff7a00 !important;
        }
        .btn-outline-primary:hover {
          background-color: #ff7a00 !important;
          color: white !important;
        }
        .text-primary {
          color: #ff7a00 !important;
        }
        .card .btn-outline-primary, .card .btn-outline-danger {
          font-size: 15px;
          padding: 6px 0;
        }
      `}</style>
    </div>
  );
};

export default ADExercises; 
