import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMinus, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext';
import { fetchProductById } from '../../services/productAPI';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const orangeColor = '#FF5722';

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    getProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  const baseUrl = 'http://gymmatehealth.runasp.net/Images/Products/';

  return (
    <div className="container py-5">
      <div className="row">
        {/* الصور */}
        <div className="col-md-6">
          <div className="d-flex gap-2 flex-md-row flex-column">
            <div className="d-flex flex-md-column gap-2">
              {[...Array(1)].map((_, i) => (
                <img
                  key={i}
                  src={`${baseUrl}${product.image_URL}`}
                  alt="thumbnail"
                  className="img-thumbnail"
                  style={{ width: "60px", height: "60px", objectFit: "contain" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'; }}
                />
              ))}
            </div>
            <div className="flex-grow-1 text-center">
              <img
                src={`${baseUrl}${product.image_URL}`}
                alt={product.product_Name}
                className="img-fluid"
                style={{ maxHeight: "400px", objectFit: "contain" }}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
            </div>
          </div>
        </div>

        {/* التفاصيل */}
        <div className="col-md-6 text-start">
          <h4>{product.product_Name}</h4>
          <h3 className="text-danger mb-3">${product.price?.toFixed(2)}</h3>
          <p className="text-muted">{product.description}</p>

          {/* الكمية + الزر */}
          <div className="d-flex align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="mx-3">{quantity}</span>
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>

            <button
              className="btn text-white ms-4"
              style={{ backgroundColor: orangeColor, borderColor: orangeColor }}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Added to Cart
                </>
              ) : (
                'Buy Now'
              )}
            </button>
          </div>

          {/* رسالة تأكيد + الزرين */}
          {added && (
            <div className="mt-4">
              <p className="text-success fw-semibold">
                ✅ Product added to cart successfully!
              </p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate('/Products')}
                >
                  🛍️ Back to Shop
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: orangeColor, color: 'white' }}
                  onClick={() => navigate('/cart')}
                >
                  🛒 Go to Cart
                </button>
              </div>
            </div>
          )}

          {/* معلومات التوصيل */}
          <div className="border p-3 mt-4 mb-2">
            <strong>🚚 Free Delivery</strong>
            <p className="mb-0 text-muted small">Enter your postal code for delivery availability</p>
          </div>
          <div className="border p-3">
            <strong>🔁 Return Delivery</strong>
            <p className="mb-0 text-muted small">Free 30 Days Delivery Returns. Details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
