import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext';
import styles from './OnlineStore.module.css';

export default function OnlineStore() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch('http://gymmatehealth.runasp.net/api/Products/GetAllProducts')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const handleAddToCart = (product) => {
    if (!isNaN(product.price) && product.price > 0) {
      addToCart(product);
    } else {
      console.error("Invalid product price:", product);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-uppercase text-center" style={{ color: '#FF5722' }}>
        OUR PRODUCTS
      </h2>
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
              <div className="card border-0 shadow-sm h-100">
                <div className="position-relative">
                  <img
                    src={`http://gymmatehealth.runasp.net/Images/Products/${product.image_URL}`}
                    alt={product.product_Name}
                    className="card-img-top img-fluid"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                </div>
                <div className={styles.cardBody}>
                  <h6 className="card-title fw-bold mb-2">{product.product_Name}</h6>
                  <p className="text-muted">{product.description}</p>
                  <div className={styles.priceSection}>
                    {product.discount > 0 && (
                      <span className="text-decoration-line-through me-2 text-muted small">
                        ${(product.price / (1 - product.discount)).toFixed(2)}
                      </span>
                    )}
                    <span className={`fw-bold ${product.discount > 0 ? 'text-danger' : 'text-dark'}`}>
                      ${(product.price).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.stockInfo}>
                    <span className={`${styles.stockBadge} ${styles[stockClass]}`}>
                      {stockStatus}
                    </span>
                    
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex gap-2">
                      <button
                        className={`${styles.addToCartBtn} ${isInCart(product.product_ID) && styles.disabledBtn}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.product_ID)}
                      >
                        {isInCart(product.product_ID) ? (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Added
                          </>
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                      {isInCart(product.product_ID) && (
                        <Link
                          to="/cart"
                          className="btn text-white flex-fill"
                          style={{
                            backgroundColor: '#FF5722',
                            borderColor: '#FF5722',
                          }}
                        >
                          View cart
                        </Link>
                      )}
                    </div>
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
    </div>
  );
}
