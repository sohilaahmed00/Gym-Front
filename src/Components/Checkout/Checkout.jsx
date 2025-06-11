import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import axios from 'axios';
// import { FaUniversity, FaMoneyBillWave } from 'react-icons/fa'; // Removed these icons as we'll use Font Awesome

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

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate(); // Add useNavigate hook
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [townCity, setTownCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل

  const [firstNameError, setFirstNameError] = useState(false);
  const [streetAddressError, setStreetAddressError] = useState(false);
  const [townCityError, setTownCityError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [paymentMethodError, setPaymentMethodError] = useState(false);
  const [paymentProofError, setPaymentProofError] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const baseUrl = 'http://gymmatehealth.runasp.net/Images/Products/';

  const handleProceedToPayment = async () => {
    let hasError = false;
    if (!firstName) {
      setFirstNameError(true);
      hasError = true;
    }
    if (!streetAddress) {
      setStreetAddressError(true);
      hasError = true;
    }
    if (!townCity) {
      setTownCityError(true);
      hasError = true;
    }
    if (!phoneNumber) {
      setPhoneNumberError(true);
      hasError = true;
    }
    if (!selectedPaymentMethod) {
      setPaymentMethodError(true);
      hasError = true;
    }
    // إذا كانت طريقة الدفع تتطلب إثبات دفع ولم يتم رفعه
    if ((selectedPaymentMethod === 'instapay' || selectedPaymentMethod === 'vodafonecash' || selectedPaymentMethod === 'fawry' || selectedPaymentMethod === 'banktransfer') && !paymentProof) {
      setPaymentProofError(true);
      hasError = true;
    }
    if (hasError) {
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('User_ID', 'f8de3c94-85b0-4c43-826e-4ef8f3f12b8f');
    formData.append('RecipientName', firstName);
    formData.append('Address', `${streetAddress}${apartment ? `, ${apartment}` : ''}`);
    formData.append('City', townCity);
    formData.append('PhoneNumber', phoneNumber);
    formData.append('PaymentMethod', selectedPaymentMethod);
    if (paymentProof) {
      formData.append('PaymentProof', paymentProof);
    }
    cart.forEach((item, index) => {
      formData.append(`Items[${index}].Product_ID`, item.id);
      formData.append(`Items[${index}].Quantity`, item.quantity);
    });
    try {
      const response = await axios.post('http://gymmatehealth.runasp.net/api/Orders/AddNewOrder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Order placed successfully:', response.data);
      clearCart();
      if (response.data && (response.data.orderId || response.data.order_id)) {
        const orderId = response.data.orderId || response.data.order_id;
        navigate(`/order-success/${orderId}`);
      } else {
        alert('Order ID not found in response!');
      }
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
      alert('An error occurred while placing the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'paymentProof') {
      const file = files[0];
      setPaymentProof(file);
      setPaymentProofError(false);
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else if (name === 'paymentMethod') {
      setSelectedPaymentMethod(value);
      setPaymentMethodError(false);
    } else if (name === 'firstName') {
      setFirstName(value);
      setFirstNameError(false);
    } else if (name === 'streetAddress') {
      setStreetAddress(value);
      setStreetAddressError(false);
    } else if (name === 'apartment') {
      setApartment(value);
    } else if (name === 'townCity') {
      setTownCity(value);
      setTownCityError(false);
    } else if (name === 'phoneNumber') {
      setPhoneNumber(value);
      setPhoneNumberError(false);
    }
  };

  return (
    <>
      <div className="container py-5">
        {/* Breadcrumb */}
        
        <div className="row">
          {/* Billing Details */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm p-4">
              <h5 className="mb-4 text-start fw-bold">Billing Details</h5>
              <form className="text-start">
                <div className="mb-3">
                  <label className="form-label fw-medium">First Name*</label>
                  <input className={`form-control ${firstNameError ? 'is-invalid' : ''}`} placeholder="Enter your first name" required name="firstName" value={firstName} onChange={handleChange} />
                  {firstNameError && <div className="text-danger small mt-1">Please enter your first name.</div>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Street Address*</label>
                  <input className={`form-control ${streetAddressError ? 'is-invalid' : ''}`} placeholder="e.g. 123 Main St" required name="streetAddress" value={streetAddress} onChange={handleChange} />
                  {streetAddressError && <div className="text-danger small mt-1">Please enter your street address.</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Apartment, floor, etc.</label>
                  <input className="form-control" placeholder="Optional" name="apartment" value={apartment} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Town/City*</label>
                  <input className={`form-control ${townCityError ? 'is-invalid' : ''}`} placeholder="Enter your city" required name="townCity" value={townCity} onChange={handleChange} />
                  {townCityError && <div className="text-danger small mt-1">Please enter your town/city.</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Phone Number*</label>
                  <input className={`form-control ${phoneNumberError ? 'is-invalid' : ''}`} placeholder="e.g. 01012345678" required name="phoneNumber" value={phoneNumber} onChange={handleChange} />
                  {phoneNumberError && <div className="text-danger small mt-1">Please enter your phone number.</div>}
                </div>
                {/* Payment Method */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Payment Method*</label>
                  <select className={`form-select ${paymentMethodError ? 'is-invalid' : ''}`} name="paymentMethod" value={selectedPaymentMethod} onChange={handleChange} required>
                    <option value="">Select a payment method</option>
                    {Object.entries(paymentMethods).filter(([key]) => key !== '').map(([key, method]) => (
                      <option key={key} value={key}>{method.name}</option>
                    ))}
                  </select>
                  {paymentMethodError && <div className="text-danger small mt-1">Please select a payment method.</div>}
                </div>
                {/* Payment Method Details */}
                {selectedPaymentMethod && paymentMethods[selectedPaymentMethod] && (
                  <div className="mb-3">
                    <div className="alert alert-info p-2">
                      <i className={`${paymentMethods[selectedPaymentMethod].iconClass} me-2`}></i>
                      <span style={{ whiteSpace: 'pre-line' }}>{paymentMethods[selectedPaymentMethod].details}</span>
                    </div>
                  </div>
                )}
                {/* Payment Proof Upload */}
                {(selectedPaymentMethod === 'instapay' || selectedPaymentMethod === 'vodafonecash' || selectedPaymentMethod === 'fawry' || selectedPaymentMethod === 'banktransfer') && (
                  <div className="mb-3">
                    <label className="form-label fw-medium">Upload Payment Proof*</label>
                    <input type="file" className={`form-control ${paymentProofError ? 'is-invalid' : ''}`} name="paymentProof" accept="image/*" onChange={handleChange} />
                    {paymentProofError && <div className="text-danger small mt-1">Please upload payment proof.</div>}
                    {previewUrl && (
                      <div className="mt-2">
                        <img src={previewUrl} alt="Payment Proof Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-5">
            <div className="border p-4 rounded shadow-sm bg-white">
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
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between fw-bold mt-2 mb-3">
                <span>Total:</span>
                <span>EGP {total.toFixed(2)}</span>
              </div>

              {/* Proceed to Payment Button */}
              <button className="btn btn-warning text-white w-100" onClick={handleProceedToPayment} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
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
