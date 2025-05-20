import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_BASE_IMAGE_URL = 'http://gymmatehealth.runasp.net'; // مسار الصور الرئيسي

const API_ENDPOINTS = {
  GET_CATEGORY: (id) => `${API_BASE_URL}/Categories/GetCategory/${id}`,
  GET_EXERCISES_BY_CATEGORY: (id) => `${API_BASE_URL}/Exercises/GetByCategoryId/${id}`,
  ADD_EXERCISE: `${API_BASE_URL}/Exercises/AddExercise`,
  UPDATE_EXERCISE: `${API_BASE_URL}/Exercises/UpdateExercise`,
  DELETE_EXERCISE: (id) => `${API_BASE_URL}/Exercises/DeleteExercise/${id}`
};

const EMPTY_EXERCISE = {
  exercise_ID: 0,
  exercise_Name: "",
  description: "",
  image_url: "",
  image_gif: "",
  duration: 30,
  target_Muscle: "",
  difficulty_Level: "متوسط",
  calories_Burned: 0,
  category_ID: 0,
  category: null
};

const DIFFICULTY_LEVELS = [
  { value: "مبتدئ", color: "success" },
  { value: "متوسط", color: "warning" },
  { value: "متقدم", color: "danger" }
];

const Exercises = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

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
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Alert helper
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

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

  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return null;
    return `${API_BASE_IMAGE_URL}/Images/${imageFileName}`;
  };

  // Fetch category info and exercises by category ID only
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category info
      const categoryResponse = await axios.get(API_ENDPOINTS.GET_CATEGORY(categoryId));
      const categoryData = categoryResponse.data;
      if (!categoryData.categoryDescription) {
        categoryData.categoryDescription = getCategoryDescription(categoryData.category_Name);
      }
      setCategory(categoryData);

      // Fetch exercises by category
      const exercisesResponse = await axios.get(API_ENDPOINTS.GET_EXERCISES_BY_CATEGORY(categoryId));
      console.log('تمارين القسم:', exercisesResponse.data);

      if (Array.isArray(exercisesResponse.data)) {
        setExercises(exercisesResponse.data);
      } else {
        setError('تنسيق بيانات التمارين غير صحيح');
      }

      setLoading(false);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
      setError('فشل في جلب البيانات');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // Delete exercise
  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التمرين؟')) return;

    try {
      setDeletingId(exerciseId);
      const response = await axios.delete(API_ENDPOINTS.DELETE_EXERCISE(exerciseId));
      if (response.status === 200) {
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
  };

  // Add exercise handlers
  const handleStartAddExercise = () => {
    setIsAddingExercise(true);
    setNewExercise({ ...EMPTY_EXERCISE, category_ID: parseInt(categoryId) });
  };
  const handleCancelAddExercise = () => setIsAddingExercise(false);

  const handleAddExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewExercise = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post(API_ENDPOINTS.ADD_EXERCISE, newExercise);
      if (response.status === 200 || response.status === 201) {
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

  // Edit exercise handlers
  const handleEditClick = (exercise) => setEditingExercise({ ...exercise });
  const handleCancelEdit = () => setEditingExercise(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.put(API_ENDPOINTS.UPDATE_EXERCISE, editingExercise);
      if (response.status === 200) {
        setExercises(exercises.map(ex => (ex.exercise_ID === editingExercise.exercise_ID ? editingExercise : ex)));
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

  // Filtering and searching
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch =
      ex.exercise_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ex.target_Muscle && ex.target_Muscle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = !difficultyFilter || ex.difficulty_Level === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty) => {
    const difficultyLevel = DIFFICULTY_LEVELS.find(level => level.value === difficulty);
    return difficultyLevel ? difficultyLevel.color : 'secondary';
  };

  const handleGoBack = () => navigate('/admin/exercise-categories');

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid py-4">
      {/* Alert */}
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

      {/* Back & Category */}
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
            <p className="text-muted mb-0 small">{category.categoryDescription}</p>
          </div>
        )}
      </div>

      {/* Add or Edit Form */}
      {isAddingExercise ? (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">إضافة تمرين جديد</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelAddExercise}>
                <i className="fas fa-times me-2"></i>إلغاء
              </button>
            </div>
            <form onSubmit={handleSubmitNewExercise}>
              <InputFields exercise={newExercise} onChange={handleAddExerciseInputChange} isSubmitting={isSubmitting} difficultyLevels={DIFFICULTY_LEVELS} />
            </form>
          </div>
        </div>
      ) : editingExercise ? (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">تعديل التمرين</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times me-2"></i>إلغاء
              </button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <InputFields exercise={editingExercise} onChange={handleInputChange} isSubmitting={isSubmitting} difficultyLevels={DIFFICULTY_LEVELS} />
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Exercises List Header */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">قائمة التمارين</h4>
                <button className="btn btn-primary" onClick={handleStartAddExercise}>
                  <i className="fas fa-plus me-2"></i>إضافة تمرين جديد
                </button>
              </div>

              {/* Filters */}
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

              {/* Exercises Table */}
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
                      <th className="border-0">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.map(exercise => (
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
                                  border: '1px solid #dee2e6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: '#f8f9fa'
                                }}
                              >
                                <img
                                  src={getImageUrl(exercise.image_url)}
                                  alt={exercise.exercise_Name}
                                  onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/60?text=صورة";
                                  }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                          <span className="text-muted" style={{
                            fontSize: '0.9rem',
                            maxWidth: '200px',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {exercise.description}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">{exercise.target_Muscle || "غير محدد"}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${getDifficultyBadge(exercise.difficulty_Level)}`}>
                            {exercise.difficulty_Level === 1 ? 'مبتدئ' :
                              exercise.difficulty_Level === 2 ? 'متوسط' :
                                exercise.difficulty_Level === 3 ? 'متقدم' : 'غير محدد'}
                          </span>
                        </td>
                        <td><span className="badge bg-info">{exercise.duration} دقيقة</span></td>
                        <td><span className="badge bg-warning">{exercise.calories_Burned} سعرة</span></td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(exercise)}>
                              <i className="fas fa-edit me-1"></i>تعديل
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
                                  <i className="fas fa-trash me-1"></i>حذف
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

              {filteredExercises.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-dumbbell text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted">لا توجد تمارين للعرض</h5>
                  <p className="text-muted">قم بإضافة تمارين جديدة لهذا القسم</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
      `}</style>
    </div>
  );
};

// Component to render Add/Edit input fields to avoid duplication
const InputFields = ({ exercise, onChange, isSubmitting, difficultyLevels }) => (
  <>
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">اسم التمرين</label>
        <input
          type="text"
          className="form-control"
          name="exercise_Name"
          value={exercise.exercise_Name || ''}
          onChange={onChange}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">مستوى الصعوبة</label>
        <select
          className="form-select"
          name="difficulty_Level"
          value={exercise.difficulty_Level || 'متوسط'}
          onChange={onChange}
          required
        >
          {difficultyLevels.map(level => (
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
        value={exercise.target_Muscle || ''}
        onChange={onChange}
        placeholder="مثال: عضلات الصدر، عضلات البطن..."
      />
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">رابط الصورة</label>
        <input
          type="text"
          className="form-control"
          name="image_url"
          value={exercise.image_url || ''}
          onChange={onChange}
          placeholder="أدخل اسم ملف الصورة"
        />
        <small className="text-muted">مثال: exercise-image.jpg</small>
      </div>
      <div className="col-md-6">
        <label className="form-label">رابط الجيف</label>
        <input
          type="text"
          className="form-control"
          name="image_gif"
          value={exercise.image_gif || ''}
          onChange={onChange}
          placeholder="أدخل اسم ملف الجيف"
        />
        <small className="text-muted">مثال: exercise-gif.gif</small>
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">وصف التمرين</label>
      <textarea
        className="form-control"
        name="description"
        value={exercise.description || ''}
        onChange={onChange}
        rows="4"
      />
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
            جارٍ المعالجة...
          </>
        ) : 'حفظ'}
      </button>
    </div>
  </>
);

export default Exercises;