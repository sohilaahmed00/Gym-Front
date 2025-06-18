import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const PlanModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  setFormData,
  categories,
  filteredExercises,
  selectedDate,
  assignments,
  nutritionPlans,
  isSameDate
}) => {
  const [errors, setErrors] = useState({});

  const isAlreadyPlanned =
    assignments.some(a => isSameDate(a.day, selectedDate)) ||
    nutritionPlans.some(n => isSameDate(n.day, selectedDate));

  const handleValidationAndSubmit = () => {
    const newErrors = {};

    // Negative value checks
    if (formData.calories < 0) newErrors.calories = "Calories can't be negative";
    if (formData.protein < 0) newErrors.protein = "Protein can't be negative";
    if (formData.carbs < 0) newErrors.carbs = "Carbs can't be negative";
    if (formData.fats < 0) newErrors.fats = "Fats can't be negative";

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
  if (!show) {
    setErrors({});
  }
}, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Plan for {selectedDate}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <h6>🏋️ Assignment</h6>

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
                isInvalid={!!errors[meal]}
              />
              <Form.Control.Feedback type="invalid">{errors[meal]}</Form.Control.Feedback>
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
