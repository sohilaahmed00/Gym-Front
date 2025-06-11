import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

// API configuration
const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';
const API_BASE_IMAGE_URL = 'http://gymmatehealth.runasp.net'; // Main image path
const API_ENDPOINTS = {
  GET_ALL_PRODUCTS: `${API_BASE_URL}/Products/GetAllProducts`,
  DELETE_PRODUCT: (id) => `${API_BASE_URL}/Products/DeleteProduct${id}`,
  UPDATE_PRODUCT: (id) => `${API_BASE_URL}/Products/UpdateProduct${id}`,
  ADD_PRODUCT: `${API_BASE_URL}/Products/AddNewProduct`
};

// Empty new product template
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [newProductImage, setNewProductImage] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    stockStatus: '',
    searchTerm: ''
  });
  
  // Alert State
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  // Image Preview State
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState('');

  // Show Alert Function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Show image in modal
  const handleShowImage = (productId, productName) => {
    if (!productId) return;
    
    setSelectedImage(productId);
    setSelectedProductName(productName);
    setShowImageModal(true);
  };

  // Product images are served from: http://gymmatehealth.runasp.net/Images/Products/
  const getImageUrl = (imageFileName) => {
    if (!imageFileName) return null;
    try {
      return `${API_BASE_IMAGE_URL}/Images/Products/${imageFileName}`;
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
        throw new Error('Failed to fetch products data');
      }
      const data = await response.json();
      console.log('Products data received:', data);
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => {
        const productName = product.product_Name?.toLowerCase() || '';
        if (filters.category === 'supplements') {
          return productName.includes('protein') || productName.includes('creatine') || 
                 productName.includes('supplement') || productName.includes('whey') ||
                 productName.includes('bcaa') || productName.includes('vitamin');
        } else if (filters.category === 'equipment') {
          return productName.includes('equipment') || productName.includes('weights') || 
                 productName.includes('dumbbell') || productName.includes('barbell') ||
                 productName.includes('machine') || productName.includes('bench');
        }
        return true;
      });
    }

    // Apply price filter
    if (filters.priceRange) {
      result = result.filter(product => {
        const price = product.price || 0;
        switch (filters.priceRange) {
          case 'low':
            return price < 300;
          case 'medium':
            return price >= 300 && price <= 500;
          case 'high':
            return price > 500;
          default:
            return true;
        }
      });
    }

    // Apply stock filter
    if (filters.stockStatus) {
      result = result.filter(product => {
        if (filters.stockStatus === 'in-stock') {
          return product.stock_Quantity > 0;
        } else if (filters.stockStatus === 'out-stock') {
          return product.stock_Quantity === 0;
        }
        return true;
      });
    }

    // Apply search filter
    if (filters.searchTerm) {
      result = result.filter(product =>
        product.product_Name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Delete product function
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeletingId(productId);
        const response = await fetch(API_ENDPOINTS.DELETE_PRODUCT(productId), {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        setProducts(products.filter(product => product.product_ID !== productId));
        showAlert('Product deleted successfully', 'success');
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
    
    if (name === 'price' || name === 'stock_Quantity') {
      setNewProduct({
        ...newProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'discount') {
      const discountValue = parseFloat(value) || 0;
      setNewProduct({
        ...newProduct,
        [name]: discountValue / 100
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value || ""
      });
    }
  };

  // Submit new product
  const handleSubmitNewProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Console log data before sending
      console.log('Product data to submit:', newProduct);
      console.log('Selected image:', newProductImage);
      
      const formData = new FormData();
      
      // Map the field names to match API expectations
      const fieldMapping = {
        'product_Name': 'Product_Name',
        'description': 'Description',
        'price': 'Price',
        'discount': 'Discount',
        'stock_Quantity': 'Stock_Quantity'
      };
      
      Object.entries(newProduct).forEach(([key, value]) => {
        // Skip product_ID and image_URL as they're not needed for new products
        if (key === 'product_ID' || key === 'image_URL') return;
        
        const apiFieldName = fieldMapping[key] || key;
        console.log(`Adding to FormData: ${apiFieldName} = ${value}`);
        formData.append(apiFieldName, value);
      });
      
      if (newProductImage) {
        console.log('Adding image to FormData:', newProductImage.name);
        formData.append('ProductImage', newProductImage);
      }
      
      // Print all FormData entries
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to add product: ${response.status} - ${errorText}`);
      }
      await fetchProducts();
      setIsAddingProduct(false);
      showAlert('Product added successfully', 'success');
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
    
    if (name === 'price' || name === 'stock_Quantity') {
      setEditingProduct({
        ...editingProduct,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'discount') {
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
      
      console.log('Editing product data:', editingProduct);
      
              // If no new image selected, try different approach
      if (!editProductImage) {
        console.log('Trying update without image using JSON...');
        const updateData = {
          Product_ID: editingProduct.product_ID,
          Product_Name: editingProduct.product_Name,
          Description: editingProduct.description,
          Price: editingProduct.price,
          Discount: editingProduct.discount,
          Stock_Quantity: editingProduct.stock_Quantity,
          Image_URL: editingProduct.image_URL
        };
        
        const response = await fetch(`http://gymmatehealth.runasp.net/api/Products/UpdateProduct${editingProduct.product_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        console.log('JSON Update response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('JSON Update error response:', errorText);
          throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
        }
        
        await fetchProducts();
        setEditingProduct(null);
        showAlert('Product updated successfully', 'success');
        return;
      }
      
      const formData = new FormData();
      
      // Map the field names to match API expectations
      const fieldMapping = {
        'product_Name': 'Product_Name',
        'description': 'Description',
        'price': 'Price',
        'discount': 'Discount',
        'stock_Quantity': 'Stock_Quantity',
        'product_ID': 'Product_ID',
        'image_URL': 'Image_URL'
      };
      
      Object.entries(editingProduct).forEach(([key, value]) => {
        // Include all fields now, image_URL will be handled properly
        const apiFieldName = fieldMapping[key] || key;
        console.log(`Adding to FormData for edit: ${apiFieldName} = ${value}`);
        formData.append(apiFieldName, value);
      });
      
      // Make sure Product_ID is included for updates
      if (!formData.has('Product_ID')) {
        formData.append('Product_ID', editingProduct.product_ID);
        console.log('Added Product_ID for update:', editingProduct.product_ID);
      }
      
      if (editProductImage) {
        console.log('Adding edit image to FormData:', editProductImage.name);
        formData.append('ProductImage', editProductImage);
      } else {
        console.log('No new image selected, creating empty file');
        // Create empty file to bypass ProductImage requirement
        const emptyFile = new File([''], 'existing-image.jpg', { type: 'image/jpeg' });
        formData.append('ProductImage', emptyFile);
      }
      
      const response = await fetch(API_ENDPOINTS.ADD_PRODUCT, {
        method: 'POST',
        body: formData
      });
      
      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
      }
      await fetchProducts();
      setEditingProduct(null);
      showAlert('Product updated successfully', 'success');
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
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {isAddingProduct ? (
        // Add Product Form
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0 text-start">Add New Product</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelAddProduct}>
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewProduct}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="product_Name" 
                    value={newProduct.product_Name || ""} 
                    onChange={handleAddProductInputChange}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="price" 
                    value={newProduct.price || 0} 
                    onChange={handleAddProductInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Discount (%)</label>
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
                  <label className="form-label">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="stock_Quantity" 
                    value={newProduct.stock_Quantity || 0} 
                    onChange={handleAddProductInputChange}
                    min="0" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Product Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                  onChange={e => setNewProductImage(e.target.files[0])}
                  required
                />
                <small className="text-muted">Choose product image</small>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  value={newProduct.description || ""} 
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
                      Adding...
                    </>
                  ) : 'Add Product'}
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
              <h4 className="fw-bold mb-0 text-start">Edit Product</h4>
              <button className="btn btn-outline-secondary" onClick={handleCancelEdit}>
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmitEdit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
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
                  <label className="form-label">Price</label>
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
                  <label className="form-label">Discount (%)</label>
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
                  <label className="form-label">Stock Quantity</label>
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
                <label className="form-label">Product Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                  onChange={e => setEditProductImage(e.target.files[0])}
                />
                <small className="text-muted">Choose new image if you want to change the current image</small>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
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
                      Saving...
                    </>
                  ) : 'Save Changes'}
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
              <h4 className="fw-bold mb-0">Manage Products</h4>
              <button 
                className="btn btn-primary"
                style={{ backgroundColor: '#ff7a00', borderColor: '#ff7a00' }}
                onClick={handleStartAddProduct}
              >
                <i className="fas fa-plus me-2"></i>
                Add New Product
              </button>
            </div>

            {/* Filters Section */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="supplements">Supplements</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">By Price</option>
                  <option value="low">Less than 300 EGP</option>
                  <option value="medium">300 - 500 EGP</option>
                  <option value="high">More than 500 EGP</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={filters.stockStatus}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                >
                  <option value="">By Stock</option>
                  <option value="in-stock">Available</option>
                  <option value="out-stock">Out of Stock</option>
                </select>
              </div>
              <div className="col-md-3">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search products..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </small>
            </div>

            {/* Table Section */}
            {filteredProducts.length === 0 ? (
              <div className="text-center p-5">
                <i className="fas fa-search fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 text-start">Product</th>
                    <th className="border-0">Description</th>
                    <th className="border-0">Price</th>
                    <th className="border-0">Discount</th>
                    <th className="border-0">Stock</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
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
                                border: '2px solid #e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                              }}
                            >
                              <img 
                                src={getImageUrl(product.image_URL)} 
                                alt={product.product_Name}
                                onError={(e) => {
                                  console.log('Error loading image:', product.image_URL);
                                  e.target.onerror = null;
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
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          {product.description}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold">{product.price} EGP</span>
                      </td>
                      <td>
                        {product.discount > 0 ? (
                          <span className="badge bg-success">
                            {product.discount * 100}%
                          </span>
                        ) : (
                          <span className="badge bg-secondary">No Discount</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${product.stock_Quantity > 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                          {product.stock_Quantity > 0 ? `${product.stock_Quantity} pcs` : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditClick(product)}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.product_ID)}
                            disabled={deletingId === product.product_ID}
                          >
                            {deletingId === product.product_ID ? (
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProductName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={getImageUrl(selectedImage)}
              alt={selectedProductName}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
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
        .form-label {
          text-align: left !important;
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