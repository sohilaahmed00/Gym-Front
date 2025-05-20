import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext.jsx';
import styles from './Cart.module.css';

export default function Cart() {
  const orangeColor = '#FF5722';
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [localQuantities, setLocalQuantities] = useState({});

  const baseUrl = 'http://gymmatehealth.runasp.net/Images/Products/';

  useEffect(() => {
    setLocalQuantities(
      cart.reduce((acc, item) => {
        acc[item.id] = typeof item.quantity === 'number' && item.quantity >= 0 ? item.quantity : 0;
        return acc;
      }, {})
    );
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      setLocalQuantities((prev) => ({ ...prev, [productId]: quantity }));
    } else {
      setLocalQuantities((prev) => ({ ...prev, [productId]: '' }));
    }
  };

  const updateCart = () => {
    cart.forEach((item) => {
      const localQuantity = localQuantities[item.id];
      const newQuantity = typeof localQuantity === 'number' && localQuantity >= 0 ? localQuantity : item.quantity;

      if (typeof newQuantity === 'number' && newQuantity >= 0 && newQuantity !== item.quantity) {
        if (newQuantity === 0) {
          if (window.confirm(`Are you sure you want to remove ${item.name} from the cart?`)) {
            removeFromCart(item.id);
          }
        } else {
          updateQuantity(item.id, newQuantity);
        }
      }
    });
    setLocalQuantities(
      cart.reduce((acc, item) => {
        acc[item.id] = typeof item.quantity === 'number' && item.quantity >= 0 ? item.quantity : 0;
        return acc;
      }, {})
    );
    alert('Cart updated successfully!');
  };

  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price);
    const quantity = localQuantities[item.id] ?? item.quantity;
    if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) return total;
    return total + price * quantity;
  }, 0);

  const shipping = 0;
  const discountAmount = discount > 0 ? (discount / 100) * subtotal : 0;
  const total = subtotal - discountAmount + shipping;

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SAVE10') {
      setDiscount(10);
      alert('Coupon applied! You got 10% off.');
    } else {
      alert('Invalid coupon code.');
      setDiscount(0);
    }
  };

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Cart</li>
        </ol>
      </nav>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle text-center">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>
                    Quantity
                    <div>
                      <small className="text-muted">(editable)</small>
                    </div>
                  </th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const quantity = localQuantities[item.id] ?? item.quantity;
                  const isZero = quantity === 0;
                  return (
                    <tr key={item.id} style={isZero ? { backgroundColor: '#fff3cd' } : {}}>
                      <td className="d-flex align-items-center">
                        <button
                          className={`btn btn-link p-0 me-2 ${styles.removeButton}`}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this item?')) {
                              removeFromCart(item.id);
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                        </button>
                        <img
                          src={`${baseUrl}${item.image}`}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginRight: '10px'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                          }}
                        />
                        {item.name}
                      </td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>
                        <div className="d-flex flex-column align-items-center">
                          <span className="fw-bold">Qty</span>
                          <input
                            type="number"
                            className="form-control form-control-sm text-center mt-1"
                            value={quantity}
                            min="0"
                            style={{
                              width: '60px',
                              fontSize: '14px',
                              padding: '2px 5px'
                            }}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          />
                          {isZero && (
                            <div className="text-warning small mt-1">This item will be removed</div>
                          )}
                        </div>
                      </td>
                      <td>${(parseFloat(item.price) * quantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
            <Link to="/" className="btn btn-outline-secondary">Return to Shop</Link>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
              <button type="button" className="btn btn-outline-secondary" onClick={updateCart}>Update Cart</button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: orangeColor, borderColor: orangeColor }}
                  onClick={applyCoupon}
                >
                  Apply Coupon
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="border p-4">
                <h5 className="fw-bold mb-3">Cart Total</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount ({discount}%):</span>
                    <span>− ${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">${total.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="btn text-white w-100"
                  style={{ backgroundColor: orangeColor, borderColor: orangeColor }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
