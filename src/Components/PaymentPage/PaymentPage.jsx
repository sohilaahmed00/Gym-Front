import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const paymentMethods = {
  '': 'Select a payment method',
  'instapay': {
    name: 'InstaPay',
    details: 'Username: @yourinstapayusername \n Please include your full name in the transaction notes.',
    iconClass: 'fas fa-money-bill-wave'
  },
  'vodafonecash': {
    name: 'Vodafone Cash',
    details: 'Phone Number: 01012345678 \n Transfer the exact amount and upload a screenshot of the transaction.',
    iconClass: 'fas fa-mobile-alt'
  },
  'fawry': {
    name: 'Fawry',
    details: 'Fawry Code: 98765 \n Use this code at any Fawry machine or app. Upload the receipt image.',
    iconClass: 'fas fa-barcode'
  },
  'banktransfer': {
    name: 'Bank Transfer',
    details: 'Bank Name: [Your Bank Name] \n Account Number: 1234567890 \n Account Name: [Your Name] \n Please include your full name as reference and upload the transfer confirmation.',
    iconClass: 'fas fa-university'
  },
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, subtotal, total } = location.state || {}; // Get cart and totals from navigation state

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const baseUrl = 'http://gymmatehealth.runasp.net/Images/Products/';

  const handlePlaceOrder = () => {
    if (!selectedPaymentMethod || !paymentProof) {
      alert('Please select a payment method and upload payment proof.');
      return;
    }
    // Here you would typically send selectedPaymentMethod and paymentProof to your backend along with cart data
    alert('Order placed successfully!');
    // Clear cart after successful order (you'd need to import useCart here and call clearCart)
    // navigate('/order-confirmation'); // Redirect to a confirmation page
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'paymentProof') {
      const file = files[0];
      setPaymentProof(file);
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else if (name === 'paymentMethod') {
      setSelectedPaymentMethod(value);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p>No items in cart to proceed with payment.</p>
        <button onClick={() => navigate('/cart')} className="btn btn-primary">Go to Cart</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav className="mb-4 small text-muted text-start">
        <a href="#" onClick={() => navigate(-1)} className="text-decoration-none text-orange">Back to Checkout</a> / <strong>Payment</strong>
      </nav>

      <div className="row">
        <div className="col-md-7 mb-4">
          {/* Optional: Display a summary of the order here before payment */}
          <div className="card shadow-sm p-4">
            <h5 className="mb-4 text-start fw-bold">Order Summary</h5>
            {cart.map(item => (
              <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 text-start">
                <div className="d-flex align-items-center">
                  <img src={`${baseUrl}${item.image}`} alt={item.name} width="40" height="40" className="me-2 rounded" />
                  <span>{item.name}</span>
                </div>
                <span>EGP {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>EGP {subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold mt-2 mb-3">
              <span>Total:</span>
              <span>EGP {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="border p-4 rounded shadow-sm bg-white">
            <h5 className="fw-bold mb-3 text-start">Payment Method:</h5>
            <div className="mb-3 text-start">
              <label className="form-label fw-medium">Select Payment Method:</label>
              <select
                name="paymentMethod"
                value={selectedPaymentMethod}
                onChange={handleChange}
                required
                className="form-select"
              >
                {Object.entries(paymentMethods).map(([key, method]) => (
                  <option key={key} value={key} disabled={key === ''}>
                    {method.name || method}
                  </option>
                ))}
              </select>
            </div>

            {selectedPaymentMethod && selectedPaymentMethod !== '' && paymentMethods[selectedPaymentMethod] && (
              <div className="border p-3 rounded mb-3 text-center">
                <h5 className="fw-bold mb-3">{paymentMethods[selectedPaymentMethod].name} Details:</h5>
                {paymentMethods[selectedPaymentMethod].iconClass && (
                  <i className={`${paymentMethods[selectedPaymentMethod].iconClass} fa-3x text-orange mb-3`}></i>
                )}
                <p style={{ whiteSpace: 'pre-wrap' }}>{paymentMethods[selectedPaymentMethod].details}</p>
              </div>
            )}

            <div className="mb-3 text-start">
              <label className="form-label fw-medium">Payment Proof:</label>
              <input
                type="file"
                name="paymentProof"
                onChange={handleChange}
                className="form-control"
                accept="image/*"
              />
              <small className="form-text text-muted">
                Please upload payment proof for admin to review your order.
              </small>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Payment Proof Preview"
                  className="img-fluid mt-2 rounded shadow-sm"
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
                />
              )}
            </div>

            <button className="btn btn-warning text-white w-100" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
} 