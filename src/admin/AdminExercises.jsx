import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_BASE_IMAGE_URL = 'http://gymmatehealth.runasp.net/images/Exercise/';

const API_ENDPOINTS = {
  GET_ALL_EXERCISES: `${API_BASE_URL}/Exercises/GetAllExercises`,
  GET_ALL_CATEGORIES: `${API_BASE_URL}/Categories/GetAllCategories`,
  ADD_EXERCISE: `${API_BASE_URL}/Exercises/AddExercise`,
  UPDATE_EXERCISE: `${API_BASE_URL}/Exercises/UpdateExercise`,
  DELETE_EXERCISE: (id) => `${API_BASE_URL}/Exercises/DeleteExercise${id}`
};

const EMPTY_EXERCISE = {
  exercise_ID: 0,
  exercise_Name: "",
  description: "",
  image_url: "",
  image_gif: "",
  duration: 30,
  target_Muscle: "",
  difficulty_Level: "",
  calories_Burned: 0,
  category_ID: 0,
  category: null
};

const DIFFICULTY_LEVELS = [
  { value: 1, label: "Beginner", color: "success" },
  { value: 2, label: "Intermediate", color: "warning" },
  { value: 3, label: "Advanced", color: "danger" }
];

const AdminExercises = () => {
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ ...EMPTY_EXERCISE });
  const [newExerciseImage, setNewExerciseImage] = useState(null);
  const [newExerciseGif, setNewExerciseGif] = useState(null);
  const [editExerciseImage, setEditExerciseImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return null;
    try {
        return `${API_BASE_IMAGE_URL}/Images/${imageFileName}`;
    } catch (err) {
        console.error('Error loading image:', err);
        return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [exercisesResponse, categoriesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.GET_ALL_EXERCISES),
        axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES)
      ]);

      if (Array.isArray(exercisesResponse.data)) {
        setExercises(exercisesResponse.data);
      } else {
        setError('Invalid exercise data format');
      }

      if (Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      setDeletingId(exerciseId);
      const response = await axios.delete(API_ENDPOINTS.DELETE_EXERCISE(exerciseId));
      if (response.status === 200) {
        setExercises(exercises.filter(ex => ex.exercise_ID !== exerciseId));
        showAlert('Exercise deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete exercise');
      }
    } catch (err) {
      showAlert('Error deleting exercise', 'danger');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartAddExercise = () => {
    setIsAddingExercise(true);
    setNewExercise({ ...EMPTY_EXERCISE });
  };

  const handleCancelAddExercise = () => setIsAddingExercise(false);

  const validateFields = () => {
    const errors = {};
    if (!newExercise.exercise_Name.trim()) errors.exercise_Name = "Exercise name is required.";
    if (!newExercise.category_ID) errors.category_ID = "Category is required.";
    if (!newExercise.difficulty_Level) errors.difficulty_Level = "Difficulty level is required.";
    if (!newExercise.target_Muscle.trim()) errors.target_Muscle = "Target muscle is required.";
    if (!newExercise.description.trim()) errors.description = "Description is required.";
    if (!newExerciseImage) errors.image = "Image is required.";
    if (!newExerciseGif) errors.gif = "GIF is required.";
    return errors;
  };

  const handleAddExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmitNewExercise = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Exercise_Name', newExercise.exercise_Name);
      formData.append('Description', newExercise.description);
      formData.append('Duration', Number(newExercise.duration));
      formData.append('Target_Muscle', newExercise.target_Muscle);
      formData.append('Difficulty_Level', Number(newExercise.difficulty_Level));
      formData.append('Calories_Burned', Number(newExercise.calories_Burned));
      formData.append('Category_ID', Number(newExercise.category_ID));
      if (newExerciseImage) formData.append('Image_url', newExerciseImage);
      if (newExerciseGif) formData.append('Image_gif', newExerciseGif);

      for (let pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
      }

      const response = await axios.post(
        `http://gymmatehealth.runasp.net/api/Exercises/AddNewExercise`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.status === 200 || response.status === 201) {
        await fetchData();
        setIsAddingExercise(false);
        showAlert('Exercise added successfully!', 'success');
      } else {
        throw new Error('Failed to add exercise.');
      }
    } catch (err) {
      console.error(err.message || 'Error adding exercise.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const formData = new FormData();
      formData.append('Exercise_Name', editingExercise.exercise_Name);
      formData.append('Description', editingExercise.description);
      formData.append('Duration', editingExercise.duration);
      formData.append('Target_Muscle', editingExercise.target_Muscle);
      formData.append('Difficulty_Level', editingExercise.difficulty_Level);
      formData.append('Calories_Burned', editingExercise.calories_Burned);
      formData.append('CategoryID', editingExercise.category_ID);
      if (editExerciseImage) {
        formData.append('image', editExerciseImage);
      }
      const response = await axios.put(`${API_BASE_URL}/Exercises/updateExercise${editingExercise.exercise_ID}`, formData);
      if (response.status === 200) {
        await fetchData();
        setEditingExercise(null);
        showAlert('Exercise updated successfully', 'success');
      } else {
        throw new Error('Failed to update exercise');
      }
    } catch (err) {
      showAlert('Error updating exercise', 'danger');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = 
      ex.exercise_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ex.target_Muscle && ex.target_Muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = !difficultyFilter || ex.difficulty_Level === difficultyFilter;
    const matchesCategory = !categoryFilter || ex.category_ID === parseInt(categoryFilter);
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyBadge = (difficulty) => {
    const difficultyLevel = DIFFICULTY_LEVELS.find(level => level.value === difficulty);
    return difficultyLevel ? difficultyLevel.color : 'secondary';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_ID === categoryId);
    return category ? category.category_Name : 'Not specified';
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid py-4">
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
            aria-label="Close"
          ></button>
        </div>
      )}

      {isAddingExercise || editingExercise ? (
        <div className="d-flex justify-content-center">
          <div className="card shadow-sm border-0 p-3" style={{ maxWidth: 500, width: '100%' }}>
            <h5 className="fw-bold mb-3 text-center" style={{ fontSize: 20 }}>{isAddingExercise ? 'Add New Exercise' : 'Edit Exercise'}</h5>
            <form onSubmit={isAddingExercise ? handleSubmitNewExercise : handleSubmitEdit}>
              <div className="mb-2">
                <label className="form-label">Exercise Name</label>
                <input type="text" className="form-control form-control-sm" name="exercise_Name" placeholder="Exercise Name" value={(isAddingExercise ? newExercise.exercise_Name : editingExercise.exercise_Name) || ''} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} required />
                {fieldErrors.exercise_Name && <div className="text-danger small">{fieldErrors.exercise_Name}</div>}
              </div>
              <div className="mb-2">
                <label className="form-label">Category</label>
                <select className="form-select form-select-sm" name="category_ID" value={(isAddingExercise ? newExercise.category_ID : editingExercise.category_ID) || ''} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.category_ID} value={cat.category_ID}>{cat.category_Name}</option>)}
                </select>
                {fieldErrors.category_ID && <div className="text-danger small">{fieldErrors.category_ID}</div>}
              </div>
              <div className="mb-2">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-select form-select-sm"
                  name="difficulty_Level"
                  value={isAddingExercise ? newExercise.difficulty_Level : editingExercise.difficulty_Level}
                  onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange}
                  required
                >
                  <option value="">Select Difficulty</option>
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {fieldErrors.difficulty_Level && <div className="text-danger small">{fieldErrors.difficulty_Level}</div>}
              </div>
              <div className="mb-2">
                <label className="form-label">Target Muscle</label>
                <input type="text" className="form-control form-control-sm" name="target_Muscle" placeholder="e.g. lats" value={(isAddingExercise ? newExercise.target_Muscle : editingExercise.target_Muscle) || ''} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} />
                {fieldErrors.target_Muscle && <div className="text-danger small">{fieldErrors.target_Muscle}</div>}
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label">Duration (min)</label>
                  <input type="number" className="form-control form-control-sm" name="duration" placeholder="Duration" value={(isAddingExercise ? newExercise.duration : editingExercise.duration) || 30} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} min="1" />
                </div>
                <div className="col-6">
                  <label className="form-label">Calories</label>
                  <input type="number" className="form-control form-control-sm" name="calories_Burned" placeholder="Calories" value={(isAddingExercise ? newExercise.calories_Burned : editingExercise.calories_Burned) || 0} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} min="0" />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea className="form-control form-control-sm" name="description" placeholder="Description" value={(isAddingExercise ? newExercise.description : editingExercise.description) || ''} onChange={isAddingExercise ? handleAddExerciseInputChange : handleInputChange} rows={2} />
                {fieldErrors.description && <div className="text-danger small">{fieldErrors.description}</div>}
              </div>
              {isAddingExercise && (
                <>
                  <div className="mb-2">
                    <label className="form-label">Exercise Image</label>
                    <input type="file" className="form-control form-control-sm" accept="image/*" onChange={e => setNewExerciseImage(e.target.files[0])} />
                    {fieldErrors.image && <div className="text-danger small">{fieldErrors.image}</div>}
                    <small className="text-muted">{newExerciseImage?.name && ` - ${newExerciseImage?.name}`}</small>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Exercise GIF</label>
                    <input type="file" className="form-control form-control-sm" accept="image/gif" onChange={e => setNewExerciseGif(e.target.files[0])} />
                    {fieldErrors.gif && <div className="text-danger small">{fieldErrors.gif}</div>}
                    <small className="text-muted">{newExerciseGif?.name && ` - ${newExerciseGif?.name}`}</small>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-sm btn-primary px-4" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Exercise List</h4>
                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ff7a00', borderColor: '#ff7a00' }}
                  onClick={handleStartAddExercise}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add New Exercise
                </button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search exercises..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    {DIFFICULTY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.category_ID} value={category.category_ID}>
                        {category.category_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 text-start">Exercise</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Description</th>
                      <th className="border-0">Target Muscle</th>
                      <th className="border-0">Level</th>
                      <th className="border-0">Duration</th>
                      <th className="border-0">Calories</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExercises.map(exercise => (
                      <tr key={exercise.exercise_ID} className="exercise-row">
                        <td className="text-start">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            {exercise.image_url ? (
                              <div style={{ width: 60, height: 60, borderRadius: '8px', overflow: 'hidden', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                <img 
                                  src={exercise.image_gif ? `${API_BASE_IMAGE_URL}${exercise.image_gif}` : `${API_BASE_IMAGE_URL}${exercise.image_url}`}
                                  alt={exercise.exercise_Name}
                                  onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/60x60?text=Image"; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: '8px', background: '#0d6efd22', color: '#0d6efd', fontSize: 20 }}>
                                <i className="fas fa-dumbbell"></i>
                              </span>
                            )}
                            <span style={{ fontWeight: 600, fontSize: 16 }}>{exercise.exercise_Name}</span>
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{getCategoryName(exercise.category_ID)}</span>
                        </td>
                        <td>
                          <span className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exercise.description}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">{exercise.target_Muscle || "Not specified"}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${getDifficultyBadge(exercise.difficulty_Level)}`}>{exercise.difficulty_Level}</span>
                        </td>
                        <td><span className="badge bg-info">{exercise.duration} min</span></td>
                        <td><span className="badge bg-warning">{exercise.calories_Burned} cal</span></td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(exercise)}>
                              <i className="fas fa-edit me-1"></i>Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteExercise(exercise.exercise_ID)}
                              disabled={deletingId === exercise.exercise_ID}
                            >
                              {deletingId === exercise.exercise_ID ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-trash me-1"></i>Delete
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
                  <h5 className="text-muted">No exercises found</h5>
                  <p className="text-muted">Add new exercises to get started</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminExercises;