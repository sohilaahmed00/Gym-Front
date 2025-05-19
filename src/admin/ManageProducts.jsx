import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

// تعريف متغيرات API
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_BASE_IMAGE_URL = 'http://gymmatehealth.runasp.net'; // مسار الصور الرئيسي
const API_ENDPOINTS = {
  GET_ALL_PRODUCTS: `${API_BASE_URL}/Products/GetAllProducts`,
  DELETE_PRODUCT: (id) => `${API_BASE_URL}/Products/DeleteProduct2?id=${id}`,
  UPDATE_PRODUCT: `${API_BASE_URL}/Products/UpdateProdcut1`,
  ADD_PRODUCT: `${API_BASE_URL}/Products/AddNewProduct`
};

// قالب منتج جديد فارغ
const EMPTY_PRODUCT = {
  product_ID: 0,
  product_Name: "",
  description: "",
  price: 0,
  discount: 0,
  stock_Quantity: 0,
  image_URL: ""
};

export default function ManageProducts() {
  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Image Preview State
  const [showImageModal, setShowImageModal] = useState(false);
  // متغير لتخزين معرف المنتج المحدد عند النقر على الصورة
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState('');

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    // إخفاء التنبيه تلقائيًا بعد 3 ثوان
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // عرض الصورة في النافذة المنبثقة
  const handleShowImage = (productId, productName) => {
    if (!productId) return;
    
    setSelectedImage(productId);
    setSelectedProductName(productName);
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
      console.error('Error loading image:', err);
      return null;
    }
  };

  // Fetch products data from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ALL_PRODUCTS);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المنتجات');
      }
      const data = await response.json();
      console.log('تم استلام بيانات المنتجات:', data);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product function
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        setDeletingId(productId);
        const response = await fetch(API_ENDPOINTS.DELETE_PRODUCT(productId), {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('فشل في حذف المنتج');
        }
        
        // تحديث قائمة المنتجات
        setProducts(products.filter(product => product.product_ID !== productId));
        showAlert('تم حذف المنتج بنجاح', 'success');
      } catch (err) {
        showAlert(err.message, 'danger');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Start adding product
  const handleStartAddProduct = () => {
    setIsAddingProduct(true);
    setNewProduct({ ...EMPTY_PRODUCT });
  };

  // Cancel adding product
  const handleCancelAddProduct = () => {
    setIsAddingProduct(false);
  };
  
  // Handle input change in add form
  const handleAddProductInputChange = (e) => {
    const { name, value } = e.target;
    
    // للتعامل مع الأرقام
    if (name === 'price' || name === 'stock_Quantity') {
      setNewProduct({
        ...newProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'discount') {
      // تحويل النسبة المئوية إلى عشري
      const discountValue = parseFloat(value) || 0;
      setNewProduct({
        ...newProduct,
        [name]: discountValue / 100
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  // Submit new product
  const handleSubmitNewProduct = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) {
        throw new Error('فشل في إضافة المنتج');
      }
      
      // إعادة تحميل البيانات من الخادم
      await fetchProducts();
      
      setIsAddingProduct(false);
      showAlert('تم إضافة المنتج بنجاح', 'success');
    } catch (err) {
      showAlert(err.message, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing product
  const handleEditClick = (product) => {
    setEditingProduct({ ...product });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // للتعامل مع الأرقام
    if (name === 'price' || name === 'stock_Quantity') {
      setEditingProduct({
        ...editingProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'discount') {
      // تحويل النسبة المئوية إلى عشري
      const discountValue = parseFloat(value) || 0;
      setEditingProduct({
        ...editingProduct,
        [name]: discountValue / 100
      });
    } else {
      setEditingProduct({
        ...editingProduct,
        [name]: value
      });
    }
  };

  // Submit updated product
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(API_ENDPOINTS.UPDATE_PRODUCT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProduct)
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث المنتج');
      }
      
      // تحديث المنتج في القائمة المحلية
      setProducts(products.map(product => 
        product.product_ID === editingProduct.product_ID ? editingProduct : product
      ));
      
      setEditingProduct(null);
      showAlert('تم تحديث المنتج بنجاح', 'success');
    } catch (err) {
      showAlert(err.message, 'danger');
    } finally {
      setIsSubmitting(false);
    }
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
      
      {isAddingProduct ? (
        // Add Product Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">إضافة منتج جديد</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelAddProduct}>
                <i className="fas fa-times me-2"></i>
                إلغاء
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewProduct}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">اسم المنتج</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="product_Name" 
                    value={newProduct.product_Name} 
                    onChange={handleAddProductInputChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">السعر</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleAddProductInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">الخصم (%)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="discount" 
                    value={(newProduct.discount || 0) * 100} 
                    onChange={handleAddProductInputChange}
                    min="0" 
                    max="100" 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">الكمية المتاحة</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock_Quantity" 
                    value={newProduct.stock_Quantity} 
                    onChange={handleAddProductInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">رابط الصورة</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="image_URL" 
                  value={newProduct.image_URL} 
                  // value={selectedImage}
                  onChange={handleAddProductInputChange}
                  placeholder="أدخل اسم ملف الصورة"
                />
                <small className="text-muted">مثال: product-image.jpg</small>
              </div>
              
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={newProduct.description} 
                  onChange={handleAddProductInputChange}
                  rows="3"
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
                  ) : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : editingProduct ? (
        // Edit Product Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">تعديل المنتج</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times me-2"></i>
                إلغاء
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">اسم المنتج</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="product_Name" 
                    value={editingProduct.product_Name || ''} 
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">السعر</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="price" 
                    value={editingProduct.price || 0} 
                    onChange={handleInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">الخصم (%)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="discount" 
                    value={(editingProduct.discount || 0) * 100} 
                    onChange={handleInputChange}
                    min="0" 
                    max="100" 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">الكمية المتاحة</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock_Quantity" 
                    value={editingProduct.stock_Quantity || 0} 
                    onChange={handleInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">رابط الصورة</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="image_URL" 
                  value={editingProduct.image_URL || ''} 
                  onChange={handleInputChange}
                  placeholder="أدخل اسم ملف الصورة"
                />
                <small className="text-muted">مثال: product-image.jpg</small>
              </div>
              
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={editingProduct.description || ''} 
                  onChange={handleInputChange}
                  rows="3"
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
        // Products List
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">إدارة المنتجات</h4>
              <button className="btn btn-primary" onClick={handleStartAddProduct}>
                <i className="fas fa-plus me-2"></i>
                إضافة منتج جديد
              </button>
            </div>

            {/* Filters Section */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <select className="form-select">
                  <option value="">جميع الفئات</option>
                  <option value="supplements">المكملات الغذائية</option>
                  <option value="equipment">معدات رياضية</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option value="">حسب السعر</option>
                  <option value="low">أقل من 300 جنيه</option>
                  <option value="medium">300 - 500 جنيه</option>
                  <option value="high">أكثر من 500 جنيه</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option value="">حسب المخزون</option>
                  <option value="in-stock">متوفر</option>
                  <option value="out-stock">غير متوفر</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="بحث عن منتجات..." />
              </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 text-start">المنتج</th>
                    <th className="border-0">الوصف</th>
                    <th className="border-0">السعر</th>
                    <th className="border-0">الخصم</th>
                    <th className="border-0">المخزون</th>
                    <th className="border-0">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.product_ID} className="product-row">
                      <td className="text-start">
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                        }}>
                          {product.image_URL ? (
                            <div 
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '2px solid #e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                              }}
                              onClick={() => handleShowImage(product.product_ID, product.product_Name)}
                              title="انقر لتكبير الصورة"
                            >
                              <img 
                                src={`http://gymmatehealth.runasp.net/Images/Products/${product.image_URL}`} 
                                alt={product.product_Name}
                                onError={(e) => {
                                  console.log('خطأ في تحميل الصورة:', product.image_URL);
                                  e.target.onerror = null;
                                  // e.target.src = "https://via.placeholder.com/80?text=صورة";
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 80,
                              height: 80,
                              borderRadius: '10px',
                              background: '#0d6efd22',
                              color: '#0d6efd',
                              fontSize: 24,
                              border: '2px solid #e9ecef',
                            }}>
                              <i className="fas fa-box"></i>
                            </div>
                          )}
                          <div>
                            <h6 style={{ 
                              margin: 0, 
                              fontWeight: 600, 
                              fontSize: 16,
                              color: '#2c3e50'
                            }}>
                              {product.product_Name}
                            </h6>
                            <small style={{ 
                              color: '#6c757d',
                              fontSize: 13
                            }}>
                              ID: {product.product_ID}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {product.description}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold">{product.price} جنيه</span>
                      </td>
                      <td>
                        {product.discount > 0 ? (
                          <span className="badge bg-success">
                            {product.discount * 100}%
                          </span>
                        ) : (
                          <span className="badge bg-secondary">بدون خصم</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${product.stock_Quantity > 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                          {product.stock_Quantity > 0 ? `${product.stock_Quantity} قطعة` : 'غير متوفر'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditClick(product)}
                          >
                            <i className="fas fa-edit me-1"></i>
                            تعديل
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.product_ID)}
                            disabled={deletingId === product.product_ID}
                          >
                            {deletingId === product.product_ID ? (
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
          <Modal.Title>{selectedProductName || 'صورة المنتج'}</Modal.Title>
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
                src={`http://gymmatehealth.runasp.net/api/Products/GetProductById1/${selectedImage}`} 
                alt="صورة المنتج" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }} 
                onError={(e) => {
                  e.target.onerror = null;
                  // e.target.src = "https://via.placeholder.com/400x300?text=صورة+غير+متوفرة";
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

      <style>{`
        .product-row:hover { 
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
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        .alert {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          animation: slideIn 0.4s ease;
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
