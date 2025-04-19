import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../CartContext/CartContext.jsx';

export default function Cart() {
  const orangeColor = '#FF5722';
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [localQuantities, setLocalQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
  );

  useEffect(() => {
    setLocalQuantities(
      cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
    );
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setLocalQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  const updateCart = () => {
    cart.forEach((item) => {
      const newQuantity = localQuantities[item.id];
      if (newQuantity && newQuantity !== item.quantity) {
        updateQuantity(item.id, newQuantity);
      }
    });
    alert('Cart updated successfully!');
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 0;
  const discountAmount = (discount / 100) * subtotal;
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
      {/* Breadcrumb */}
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
          {/* Cart Table */}
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="d-flex align-items-center">
                      <button className="btn btn-link p-0 me-2" onClick={() => {
                        if (window.confirm('Are you sure you want to remove this item?')) {
                          removeFromCart(item.id);
                        }
                      }}>
                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginRight: '10px'
                        }}
                      />
                      {item.name}
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <span className="mb-1">Quantity</span>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                (localQuantities[item.id] || item.quantity) - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="mx-2">{localQuantities[item.id] || item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                (localQuantities[item.id] || item.quantity) + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>${(item.price * (localQuantities[item.id] || item.quantity)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
            <Link to="/" className="btn btn-outline-secondary">Return to Shop</Link>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
              <button className="btn btn-outline-secondary" onClick={updateCart}>Update Cart</button>
            </div>
          </div>

          {/* Coupon + Cart Summary */}
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
                {discount > 0 && (
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

          {/* Styling */}
          <style jsx>{`
      .btn:hover {
        background-color: #e64a19 !important;
        border-color: #e64a19 !important;
      }
      .table th,
      .table td {
        vertical-align: middle;
      }
      .form-control:focus {
        border-color: ${orangeColor};
        box-shadow: 0 0 0 0.2rem rgba(255, 87, 34, 0.25);
      }

      /* تأثير hover على زر حذف المنتج */
      .btn-link:hover svg {
        color: white !important;
      }
    `}</style>

    </div>
  );
}
