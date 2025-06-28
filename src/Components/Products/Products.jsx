import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faSpinner, faShoppingCart, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext';
import styles from './OnlineStore.module.css';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../../config';

// دالة لفك تشفير التوكن (JWT)
function decodeJWT(token) {
  if (!token) return {};
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

export default function OnlineStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    searchTerm: ''
  });
  const { cart, addToCart } = useCart();
  const location = useLocation();

  // جلب role من التوكن
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.roles?.length) {
        setRole(decoded.roles[0]);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/Products/GetAllProducts`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const handleAddToCart = (product) => {
    if (!isNaN(product.price) && product.price > 0) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    const searchTermLower = filters.searchTerm.toLowerCase().trim();
    const matchesSearch = product.product_Name.toLowerCase().includes(searchTermLower);
    
    let matchesCategory = true;
    if (filters.category) {
      const productNameLower = product.product_Name.toLowerCase();
      if (filters.category === 'supplements') {
        matchesCategory = productNameLower.includes('protein') || productNameLower.includes('creatine') || 
                          productNameLower.includes('supplement') || productNameLower.includes('whey') ||
                          productNameLower.includes('bcaa') || productNameLower.includes('vitamin');
      } else if (filters.category === 'equipment') {
        matchesCategory = productNameLower.includes('equipment') || productNameLower.includes('weights') || 
                          productNameLower.includes('dumbbell') || productNameLower.includes('barbell') ||
                          productNameLower.includes('machine') || productNameLower.includes('bench');
      }
    }

    const matchesPrice = !filters.priceRange || (
      filters.priceRange === 'low' ? product.price < 300 :
      filters.priceRange === 'medium' ? product.price >= 300 && product.price <= 500 :
      filters.priceRange === 'high' ? product.price > 500 : true
    );
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.productsPage}>
      <div className={styles.heroSection}>
        <h1>Our Products</h1>
        <p>Discover our premium selection of fitness equipment and supplements</p>
      </div>

      <div className={styles.container}>
        {/* Filters Section */}
        <div className={styles.filtersSection}>
          <button 
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} /> Filters
          </button>

          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="supplements">Supplements</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="low">Under 300 EGP</option>
                  <option value="medium">300 - 500 EGP</option>
                  <option value="high">Over 500 EGP</option>
                </select>
              </div>

              <div className={styles.searchBox}>
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.noProductsContainer}>
            <p>No products found matching your criteria</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => {
              const stockQuantity = product.stock_Quantity;
              let stockStatus = 'IN STOCK';
              let stockClass = 'instock';

              if (stockQuantity === 0) {
                stockStatus = 'OUT OF STOCK';
                stockClass = 'outofstock';
              } else if (stockQuantity <= 5) {
                stockStatus = 'LOW STOCK';
                stockClass = 'lowstock';
              }

              return (
                <div className={styles.productCard} key={product.product_ID}>
                  <div className={styles.productImage}>
                    <img
                      src={`${API_BASE_IMAGE_URL}/Images/Products/${product.image_URL}`}
                      alt={product.product_Name}
                    />
                    {product.discount > 0 && (
                      <span className={styles.discountBadge}>
                        {Math.round(product.discount * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <h3>{product.product_Name}</h3>
                    <p>{product.description}</p>
                    
                    <div className={styles.priceSection}>
                      {product.discount > 0 && (
                        <span className={styles.originalPrice}>
                          EGP {(product.price / (1 - product.discount)).toFixed(2)}
                        </span>
                      )}
                      <span className={styles.currentPrice}>
                        EGP {product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className={styles.stockInfo}>
                      <span className={`${styles.stockBadge} ${styles[stockClass]}`}>
                        {stockStatus}
                      </span>
                    </div>

                    <div className={styles.actionButtons}>
                      {role !== 'Coach' && (
                        <button
                          className={`${styles.addToCartBtn} ${isInCart(product.product_ID) ? styles.disabledBtn : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={isInCart(product.product_ID)}
                        >
                          {isInCart(product.product_ID) ? (
                            <>
                              <FontAwesomeIcon icon={faCheck} />
                              Added
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faShoppingCart} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      )}
                      <Link to={`/product/${product.product_ID}`} className={styles.viewDetailsBtn}>
                        <FontAwesomeIcon icon={faEye} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}