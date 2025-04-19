import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext.jsx';

export default function OnlineStore() {
  const [products, setProducts] = useState([]);
  const orangeColor = '#FF5722';
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products') // غيري الرابط برابط الـ API بتاعك
      .then((res) => res.json())
      .then((data) => {
        const formattedProducts = data.map((item) => ({
          id: item.id,
          name: item.title,
          image: item.image,
          price: item.price,
          rating: Math.floor(item.rating?.rate || 5), // لو الـ API فيه تقييم
          sale: item.price < 50, // مثال: المنتجات الأقل من 50 تكون في تخفيض
          originalPrice: item.price < 50 ? item.price + 10 : null,
        }));
        setProducts(formattedProducts);
      });
  }, []);

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const handleAddToCart = (product) => {
    // تأكد من أن السعر صحيح قبل إضافة المنتج
    if (!isNaN(product.price) && product.price > 0) {
      addToCart(product);
    } else {
      console.error("Invalid product price:", product);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-uppercase text-center">ONLINE STORE</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-3 col-sm-6" key={product.id}>
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="position-relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top img-fluid"
                  style={{ height: "230px", objectFit: "contain" }}
                />
                {product.sale && (
                  <span
                    className="position-absolute top-0 end-0 text-white px-2 py-1 small rounded-0"
                    style={{ backgroundColor: orangeColor }}
                  >
                    SALE
                  </span>
                )}
              </div>
              <div className="card-body text-center d-flex flex-column">
                <h6 className="card-title fw-bold mb-2">{product.name}</h6>
                <div className="mb-2 text-warning">
                  {[...Array(product.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="me-1" />
                  ))}
                </div>
                <div className="mb-3">
                  {product.originalPrice && (
                    <span className="text-decoration-line-through me-2 text-muted small">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className={`fw-bold ${product.sale ? 'text-danger' : 'text-dark'}`}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <button
                      className="btn text-white flex-fill"
                      style={{
                        backgroundColor: orangeColor,
                        borderColor: orangeColor,
                      }}
                      onClick={() => handleAddToCart(product)}  // استخدم الدالة المعدلة هنا
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                          Added
                        </>
                      ) : (
                        "Add to cart"
                      )}
                    </button>
                    {isInCart(product.id) && (
                      <Link
                        to="/cart"
                        className="btn text-white flex-fill"
                        style={{
                          backgroundColor: orangeColor,
                          borderColor: orangeColor,
                        }}
                      >
                        View cart
                      </Link>
                    )}
                  </div>
                  <Link to={`/product/${product.id}`} className="btn btn-outline-orange mt-2 w-100">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Quick View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .btn:hover {
          background-color: #e64a19 !important;
          border-color: #e64a19 !important;
        }
        .btn-outline-orange:hover {
          background-color: ${orangeColor} !important;
          color: white !important;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
