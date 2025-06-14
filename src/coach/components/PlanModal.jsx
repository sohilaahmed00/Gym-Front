// PlanModal.js
import React from 'react';
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
  selectedDate
}) => {
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
                    src={`http://gymmatehealth.runasp.net/images/Exercise/${option.image_url}`}
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
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="success" onClick={onSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlanModal;
