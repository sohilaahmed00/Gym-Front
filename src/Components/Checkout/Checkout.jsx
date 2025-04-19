import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import { FaUniversity, FaMoneyBillWave } from 'react-icons/fa';

export default function Checkout() {
  const { cart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cash');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      alert('Coupon applied: 10% off');
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <>
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav className="mb-4 small text-muted text-start">
          <Link to="/" className="text-decoration-none text-orange">Account</Link> / My Account / Product / View Cart / <strong>CheckOut</strong>
        </nav>

        <div className="row">
          {/* Billing Details */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm p-4">
              <h5 className="mb-4 text-start fw-bold">Billing Details</h5>
              <form className="text-start">
                <div className="mb-3">
                  <label className="form-label fw-medium">First Name*</label>
                  <input className="form-control" placeholder="Enter your first name" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Company Name</label>
                  <input className="form-control" placeholder="Optional" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Street Address*</label>
                  <input className="form-control" placeholder="e.g. 123 Main St" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Apartment, floor, etc.</label>
                  <input className="form-control" placeholder="Optional" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Town/City*</label>
                  <input className="form-control" placeholder="Enter your city" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Phone Number*</label>
                  <input className="form-control" placeholder="e.g. 01012345678" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Email Address*</label>
                  <input type="email" className="form-control" placeholder="you@example.com" required />
                </div>
                <div className="form-check mt-3">
                  <input type="checkbox" className="form-check-input" id="saveInfo" />
                  <label htmlFor="saveInfo" className="form-check-label small">
                    Save this information for faster check-out next time
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-5">
            <div className="border p-4 rounded shadow-sm bg-white">
              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 text-start">
                  <div className="d-flex align-items-center">
                    <img src={item.image} alt={item.name} width="40" height="40" className="me-2 rounded" />
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between fw-bold mt-2 mb-3">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Payment Method */}
              <div className="mb-3 text-start">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={selectedPayment === 'bank'}
                    onChange={() => setSelectedPayment('bank')}
                  />
                  <label className="form-check-label">
                    <FaUniversity className="me-2 text-orange" /> Bank Transfer
                  </label>
                </div>
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={selectedPayment === 'cash'}
                    onChange={() => setSelectedPayment('cash')}
                  />
                  <label className="form-check-label">
                    <FaMoneyBillWave className="me-2 text-orange" /> Cash on Delivery
                  </label>
                </div>
                <div className="mt-3 small">
                  <img src="/images/payments.png" alt="Payments" width="100" />
                </div>
              </div>

              {/* Coupon */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn btn-warning text-white" onClick={applyCoupon}>Apply Coupon</button>
              </div>

              {/* Place Order */}
              <button className="btn btn-warning text-white w-100" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          .text-orange {
            color: #FF5722;
          }
          .btn-warning {
            background-color: #FF5722;
            border-color: #FF5722;
          }
          .btn-warning:hover {
            background-color: #e64a19;
            border-color: #e64a19;
          }
          .form-label {
            font-size: 14px;
            color: #333;
          }
          .form-control {
            font-size: 14px;
            padding: 10px;
          }
          input::placeholder {
            font-size: 13px;
            color: #aaa;
          }
        `}
      </style>
    </>
  );
}
