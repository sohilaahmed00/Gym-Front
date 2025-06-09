import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faSpinner, faShoppingCart } from '@fortawesome/free-solid-svg-icons';  // Importing spinner icon for loading
import { useCart } from '../CartContext/CartContext';
import styles from './OnlineStore.module.css';

export default function OnlineStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // State to handle loading state
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch('http://gymmatehealth.runasp.net/api/Products/GetAllProducts')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);  // Set loading to false once products are loaded
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);  // Set loading to false in case of an error
      });
  }, []);

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const handleAddToCart = (product) => {
    if (!isNaN(product.price) && product.price > 0) {
      addToCart({ ...product, quantity: 1 });
    } else {
      console.error("Invalid product price:", product);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-uppercase text-center" style={{ color: '#FF5722' }}>
        OUR PRODUCTS
      </h2>

      
      {loading ? (
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} color='#FF5722' spin size="3x" />
        </div>
      ) : products.length === 0 ? (
        <div className={styles.noProductsContainer}>
          <p>No products available</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
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
              <div className="col-md-4 col-sm-6" key={product.product_ID}>
                <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden rounded-4">
                  <div className="position-relative d-flex justify-content-center align-items-center bg-light rounded-top-4" style={{ height: '250px' }}>
                    <img
                      src={`http://gymmatehealth.runasp.net/Images/Products/${product.image_URL}`}
                      alt={product.product_Name}
                      className="img-fluid"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    {/* Sale Badge (Static for now) */}
                    <span className="badge bg-info text-white position-absolute top-0 start-0 m-2 rounded-pill" style={{ fontSize: '0.8rem' }}>Sale</span>
                  </div>
                  <div className="p-3">
                    <h6 className="card-title fw-bold mb-2">{product.product_Name}</h6>
                    <p className="text-muted">{product.description}</p>
                    <div className={styles.priceSection}>
                      {product.discount > 0 && (
                        <span className="text-decoration-line-through me-2 text-muted small">
                          EGP {(product.price / (1 - product.discount)).toFixed(2)}
                        </span>
                      )}
                      <span className={`fw-bold ${product.discount > 0 ? 'text-danger' : 'text-dark'}`}>
                        EGP {(product.price).toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.stockInfo}>
                      <span className={`${styles.stockBadge} ${styles[stockClass]}`}>
                        {stockStatus}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <button
                        className={`btn ${styles.addToCartBtn} ${isInCart(product.product_ID) ? styles.disabledBtn : ''} w-100`}
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.product_ID)}
                      >
                        {isInCart(product.product_ID) ? (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                            Add
                          </>
                        )}
                      </button>
                      <Link to={`/product/${product.product_ID}`} className="btn btn-outline-orange mt-2 w-100">
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        Quick View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
