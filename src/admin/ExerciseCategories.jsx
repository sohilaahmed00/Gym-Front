import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// تعريف متغيرات API
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_BASE_IMAGE_URL = 'http://gymmatehealth.runasp.net'; // مسار الصور الرئيسي
const API_ENDPOINTS = {
  GET_ALL_CATEGORIES: `${API_BASE_URL}/Categories/GetAllCategories`,
  ADD_CATEGORY: `${API_BASE_URL}/Categories/AddNewCategory`,
  UPDATE_CATEGORY: (id) => `${API_BASE_URL}/Categories/Updatecategory/${id}`,
  DELETE_CATEGORY: (id) => `${API_BASE_URL}/Categories/Deletecategory/${id}`
};

// قالب قسم جديد فارغ
const EMPTY_CATEGORY = {
  category_ID: 0,
  category_Name: "",
  imageUrl: ""
};

const ExerciseCategories = () => {
  const navigate = useNavigate();
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ ...EMPTY_CATEGORY });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Image Preview State
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // إخفاء التنبيه تلقائيًا بعد 3 ثوان
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // عرض الصورة في النافذة المنبثقة
  const handleShowImage = (imageUrl, categoryName, event) => {
    if (!imageUrl) return;
    
    // منع انتشار الحدث
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedImage(imageUrl);
    setSelectedCategoryName(categoryName);
    setShowImageModal(true);
  };

  // Function to get correct image URL
  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return null;
    
    // إذا كان الرابط يحتوي على http فهو رابط كامل
    if (imageFileName.startsWith('http')) {
      return imageFileName;
    }
    
    // طباعة اسم الملف للتحقق
    console.log('Image File Name:', imageFileName);
    
    // تنظيف اسم الملف من أي مسارات غير ضرورية
    const cleanFileName = imageFileName.replace(/^[\/\\]+/, '');
    
    // محاولة المسارات المختلفة
    const possiblePaths = [
      `${API_BASE_IMAGE_URL}/Files/Categories/${cleanFileName}`,
      `${API_BASE_IMAGE_URL}/files/categories/${cleanFileName}`,
      `${API_BASE_IMAGE_URL}/Images/${cleanFileName}`,
      `${API_BASE_IMAGE_URL}/images/${cleanFileName}`,
      `${API_BASE_IMAGE_URL}/Uploads/${cleanFileName}`,
      `${API_BASE_IMAGE_URL}/uploads/${cleanFileName}`
    ];
    
    // طباعة المسارات المحتملة للتحقق
    console.log('Possible Image Paths:', possiblePaths);
    
    // إرجاع المسار الأول (سيتم التعامل مع الأخطاء في onError)
    return possiblePaths[0];
  };

  // Fetch categories data from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      
      // استخدام البيانات كما هي من API
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError('فشل في جلب بيانات الأقسام');
      setLoading(false);
      console.error(err);
    }
  };

  // دالة لإرجاع وصف افتراضي للأقسام
  const getCategoryDescription = (categoryName) => {
    return "مجموعة متنوعة من التمارين الرياضية";
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category function
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setDeletingId(categoryId);
        const response = await axios.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryId));
        console.log(response);
        if (response.status === 200) {
          // تحديث قائمة الأقسام
          setCategories(categories.filter(cat => cat.category_ID !== categoryId));
          showAlert('Category deleted successfully', 'success');
        } else {
          throw new Error('Failed to delete category');
        }
      } catch (err) {
        showAlert('Error while deleting category', 'danger');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Start adding category
  const handleStartAddCategory = () => {
    setIsAddingCategory(true);
    setNewCategory({ ...EMPTY_CATEGORY });
  };

  // Cancel adding category
  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
  };
  
  // Handle input change in add form
  const handleAddCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // Submit new category
  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // تجهيز البيانات بالتنسيق المطلوب
      const payload = {
        CategoryName: newCategory.category_Name,
        CategoryImage: newCategory.imageUrl
      };
      
      const response = await axios.post(API_ENDPOINTS.ADD_CATEGORY, payload);
      
      if (response.status === 201 || response.status === 200) {
        // إعادة تحميل البيانات من الخادم
        await fetchCategories();
        
        setIsAddingCategory(false);
        showAlert('Category added successfully', 'success');
      } else {
        throw new Error('Failed to add category');
      }
    } catch (err) {
      showAlert('Error while adding category', 'danger');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing category
  const handleEditClick = (category) => {
    setEditingCategory({ ...category });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory({
      ...editingCategory,
      [name]: value
    });
  };

  // Submit updated category
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await axios.put(API_ENDPOINTS.UPDATE_CATEGORY(editingCategory.category_ID), editingCategory);
      
      if (response.status === 200) {
        // تحديث القسم في القائمة المحلية
        setCategories(categories.map(cat => 
          cat.category_ID === editingCategory.category_ID ? editingCategory : cat
        ));
        
        setEditingCategory(null);
        showAlert('Category updated successfully', 'success');
      } else {
        throw new Error('Failed to update category');
      }
    } catch (err) {
      showAlert('Error while updating category', 'danger');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(cat => 
    cat.category_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to exercises page
  const handleViewExercises = (categoryId) => {
    navigate(`/admin/exercises/${categoryId}`);
  };

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
      
      {isAddingCategory ? (
        // Add Category Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Add New Category</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelAddCategory}>
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewCategory}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="category_Name" 
                  value={newCategory.category_Name} 
                  onChange={handleAddCategoryInputChange}
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="imageUrl" 
                  value={newCategory.imageUrl} 
                  onChange={handleAddCategoryInputChange}
                  placeholder="Enter image filename"
                />
                <small className="text-muted">Example: category-image.jpg</small>
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
                      Adding...
                    </>
                  ) : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : editingCategory ? (
        // Edit Category Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Edit Category</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="category_Name" 
                  value={editingCategory.category_Name || ''} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="imageUrl" 
                  value={editingCategory.imageUrl || ''} 
                  onChange={handleInputChange}
                  placeholder="Enter image filename"
                />
                <small className="text-muted">Example: category-image.jpg</small>
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
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Categories List
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Exercise Categories Management</h4>
              <button className="btn btn-primary" onClick={handleStartAddCategory}>
                <i className="fas fa-plus me-2"></i>
                Add New Category
              </button>
            </div>

            {/* Search Section */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredCategories.map((category) => (
                <div className="col" key={category.category_ID}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div 
                      className="position-relative cursor-pointer"
                      onClick={() => handleViewExercises(category.category_ID)}
                    >
                      <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '120px' }}>
                        {category.imageUrl ? (
                          <img 
                            src={`http://gymmatehealth.runasp.net/images/category/${category.imageUrl}`}
                            alt={category.category_Name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                            onError={(e) => {
                              console.log('Image Error:', e.target.src);
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/400x300?text=" + category.category_Name;
                            }}
                          />
                        ) : (
                          <i className="fas fa-dumbbell fa-3x text-secondary"></i>
                        )}
                      </div>
                      <div className="category-overlay">
                        <span className="view-exercises-btn">
                          <i className="fas fa-eye me-1"></i>
                          View Exercises
                        </span>
                      </div>
                    </div>
                    
                    <div 
                      className="card-body cursor-pointer" 
                      onClick={() => handleViewExercises(category.category_ID)}
                    >
                      <h5 className="card-title fw-bold mb-2">{category.category_Name}</h5>
                    </div>
                    
                    <div className="card-footer bg-white border-0 d-flex justify-content-between">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(category);
                        }}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.category_ID);
                        }}
                        disabled={deletingId === category.category_ID}
                      >
                        {deletingId === category.category_ID ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-folder-open text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="text-muted">No categories found</h5>
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
          <Modal.Title>{selectedCategoryName || 'Category Image'}</Modal.Title>
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
                alt="Category Image" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
                onError={(e) => {
                  console.log("Image loading error:", selectedImage);
                  e.target.onerror = null;
                  
                  // محاولة مسار بديل بحروف صغيرة
                  const fallbackUrl = selectedImage.replace('/Files/Categories/', '/files/categories/');
                  e.target.src = fallbackUrl;
                  
                  // في حالة استمرار الخطأ
                  e.target.onerror = () => {
                    // محاولة مسار ثالث
                    const fallbackUrl2 = selectedImage.replace('/Files/Categories/', '/Images/');
                    e.target.src = fallbackUrl2;
                    
                    // في حالة استمرار الخطأ
                    e.target.onerror = () => {
                      e.target.src = "https://via.placeholder.com/400x300?text=" + selectedCategoryName;
                    };
                  };
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .category-thumbnail {
          height: 200px;
          object-fit: cover;
          width: 100%;
        }
        .category-image {
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px 8px 0 0;
        }
        .cursor-pointer {
          cursor: pointer;
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
        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 8px 8px 0 0;
        }
        
        .position-relative:hover .category-overlay {
          opacity: 1;
        }
        
        .view-exercises-btn {
          background-color: #ff7a00;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ExerciseCategories; 