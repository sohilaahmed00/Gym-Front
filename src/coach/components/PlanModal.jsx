import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { API_BASE_IMAGE_URL } from '../../config';

const PlanModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  categories,
  filteredExercises,
  selectedDate,
  assignments = [],
  nutritionPlans = [],
  isSameDate
}) => {
  const [errors, setErrors] = useState({});

  const isAlreadyPlanned =
    Array.isArray(assignments) && assignments.some(a => isSameDate(a.day, selectedDate)) ||
    Array.isArray(nutritionPlans) && nutritionPlans.some(n => isSameDate(n.day, selectedDate));

  const handleValidationAndSubmit = () => {
    const newErrors = {};

    // Negative number check
    ['calories', 'protein', 'carbs', 'fats'].forEach(field => {
      const value = Number(formData[field]);
      if (value < 0) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} can't be negative`;
    });

    // Required meals
    ['firstMeal', 'secondMeal', 'thirdMeal'].forEach(meal => {
      if (!formData.meals[meal]?.trim()) {
        newErrors[meal] = `${meal} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit();
    }
  };

  useEffect(() => {
    if (!show) setErrors({});
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Plan for {selectedDate}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <h6>🏋️ Assignment</h6>

          {/* Category */}
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

          {/* Exercises */}
          <Form.Group className="mb-3">
            <Form.Label>Exercises</Form.Label>
            <Select
              isMulti
              options={filteredExercises}
              value={formData.selectedExercises}
              onChange={(selected) =>
                setFormData({ ...formData, selectedExercises: selected || [] })
              }
              placeholder="Select exercises"
              className="basic-multi-select"
              classNamePrefix="select"
              formatOptionLabel={option => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={`${API_BASE_IMAGE_URL}/images/Exercise/${option.image_url}`}
                    alt={option.label}
                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <span>{option.label}</span>
                </div>
              )}
            />
          </Form.Group>

          {/* Notes */}
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

          {/* Meals */}
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
                isInvalid={!!errors[meal]}
              />
              <Form.Control.Feedback type="invalid">{errors[meal]}</Form.Control.Feedback>
            </Form.Group>
          ))}

          {/* Nutrition Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.nutritionNotes}
              onChange={e => setFormData({ ...formData, nutritionNotes: e.target.value })}
            />
          </Form.Group>

          {/* Macros */}
          <Form.Group className="mb-3 d-flex gap-2">
            {['calories', 'protein', 'carbs', 'fats'].map((field) => (
              <div className="w-100" key={field}>
                <Form.Control
                  type="number"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  isInvalid={!!errors[field]}
                />
                <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
              </div>
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        {!isAlreadyPlanned && (
          <Button variant="success" onClick={handleValidationAndSubmit}>Save</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PlanModal;
