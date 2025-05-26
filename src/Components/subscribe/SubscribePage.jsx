import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SubscribePage.module.css';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

const planPrices = {
  '3_Months': 300,
  '6_Months': 600,
  '1_Year': 900,
};

const planNames = {
  '3_Months': '3 Months Plan',
  '6_Months': '6 Months Plan',
  '1_Year': '1 Year Plan',
};

const paymentMethods = {
  '': 'Select a payment method',
  'instapay': {
    name: 'InstaPay',
    details: 'Username: @yourinstapayusername \n Please include your full name in the transaction notes.',
    iconClass: 'fas fa-money-bill-wave' // Using Font Awesome icon class
  },
  'vodafonecash': {
    name: 'Vodafone Cash',
    details: 'Phone Number: 01012345678 \n Transfer the exact amount and upload a screenshot of the transaction.',
    iconClass: 'fas fa-mobile-alt' // Using Font Awesome icon class
  },
  'fawry': {
    name: 'Fawry',
    details: 'Fawry Code: 98765 \n Use this code at any Fawry machine or app. Upload the receipt image.',
    iconClass: 'fas fa-barcode' // Using Font Awesome icon class
  },
  'banktransfer': {
    name: 'Bank Transfer',
    details: 'Bank Name: [Your Bank Name] \n Account Number: 1234567890 \n Account Name: [Your Name] \n Please include your full name as reference and upload the transfer confirmation.',
    iconClass: 'fas fa-university' // Using Font Awesome icon class
  },
  // Add other payment methods as needed
};

const SubscribePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);

  const planFromState = location.state?.plan || '';
  const coachIdFromState = location.state?.coachId || '';

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const isCoachPreselected = Boolean(coachIdFromState);

  const [formData, setFormData] = useState({
    userId: '',
    coachId: coachIdFromState,
    subscriptionType: planFromState,
    paymentProof: null,
   
  });

  useEffect(() => {
    fetch('http://gymmatehealth.runasp.net/api/Coaches/AllApprovedCoaches')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setCoaches(data))
      .catch(err => {
        console.error('Fetch error:', err);
        setCoaches([]);
      });

    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setFormData(prev => ({ ...prev, userId: storedUserId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'paymentProof') {
      const file = files[0];
      setFormData(prev => ({ ...prev, paymentProof: file }));

      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'paymentMethod') {
        setSelectedPaymentMethod(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // if (!formData.paymentMethod) {
    //   toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select a payment method.', life: 3000 });
    //   setLoading(false);
    //   return;
    // }

    const data = new FormData();
    data.append('User_ID', formData.userId);
    data.append('Coach_ID', formData.coachId);
    data.append('SubscriptionType', formData.subscriptionType);
    if (formData.paymentProof) {
      data.append('PaymentProof', formData.paymentProof);
    }
console.log(formData);

    fetch('http://gymmatehealth.runasp.net/api/Subscribes/AddNewSubscribe', {
      method: 'POST',
      body: data,
    })
      .then(res => {
        setLoading(false);
        if (res.ok) {
          toast.current.show({ severity: 'success', summary: 'Success', detail: 'Subscription successful!, Waiting for admin approval', life: 3000 });
          setTimeout(() => {
            navigate('/');
          }, 3000);
          setFormData(prev => ({ ...prev, paymentProof: null, coachId: isCoachPreselected ? coachIdFromState : '' }));
          setPreviewUrl(null);
        } else {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to subscribe.', life: 3000 });
        }
      })
      .catch(err => {
        setLoading(false);
        toast.current.show({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to subscribe.', life: 3000 });
      });
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <h2 className={styles.heading}>
        Subscribe to {planNames[formData.subscriptionType] || formData.subscriptionType.replace(/([A-Z])/g, ' $1').trim()}
      </h2>

      <p className={styles.priceText}>
        Price: {planPrices[formData.subscriptionType] ? `${planPrices[formData.subscriptionType]} EGP` : 'N/A'}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="userId" value={formData.userId} />

        {/* حقل اختيار الخطة في حال عدم تحديدها في الصفحة */}
        {!formData.subscriptionType && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Subscription Plan:</label>
            <select
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select a plan</option>
              <option value="3_Months">3 Months Plan</option>
              <option value="6_Months">6 Months Plan</option>
              <option value="1_Year">1 Year Plan</option>
            </select>
          </div>
        )}

        <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
          <div className={styles.flexGrow}>
            <label className={styles.label}>Choose Coach:</label>
            <select
              name="coachId"
              value={formData.coachId}
              onChange={handleChange}
              required
              disabled={isCoachPreselected}
              className={styles.select}
            >
              <option value="">Select a coach</option>
              {coaches.map(coach => (
                <option key={coach.userId} value={coach.userId}>
                  {coach.fullName}
                </option>
              ))}
            </select>
            {isCoachPreselected && (
              <small className={styles.coachPreselectedNote}>
                Coach is pre-selected and cannot be changed.
              </small>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (formData.coachId) {
                navigate(`/coach/${formData.coachId}`);
              } else {
                toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select a coach first to view profile.', life: 3000 });
              }
            }}
            disabled={!formData.coachId}
            className={styles.viewProfileBtn}
          >
            View Coach Profile
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Subscription Type:</label>
          <input
            type="text"
            name="subscriptionType"
            value={formData.subscriptionType}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Payment Method:</label>
          <select
            name="paymentMethod"
            value={selectedPaymentMethod}
            onChange={(e)=>{setSelectedPaymentMethod(e.target.value)}}
            required
            className={styles.select}
          >
            {Object.entries(paymentMethods).map(([key, method]) => (
              <option key={key} value={key} disabled={key === ''}>
                {method.name || method}
              </option>
            ))}
          </select>
        </div>

        {selectedPaymentMethod && selectedPaymentMethod !== '' && paymentMethods[selectedPaymentMethod] && (
          <div className={`${styles.formGroup} ${styles.paymentDetails}`}>
            <h3>{paymentMethods[selectedPaymentMethod].name} Details:</h3>
            {paymentMethods[selectedPaymentMethod].iconClass && (
              <i className={`${paymentMethods[selectedPaymentMethod].iconClass} ${styles.paymentMethodIcon}`}></i>
            )}
            <p className={styles.paymentDetailsText}>{paymentMethods[selectedPaymentMethod].details}</p>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Payment Proof:</label>
          <input
            type="file"
            name="paymentProof"
            onChange={handleChange}
            required
            className={styles.input}
            accept="image/*"
          />
          <small className={styles.paymentNote}>
            Please upload payment proof for admin to review your subscription.
          </small>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Payment Proof Preview"
              className={styles.imagePreview}
            />
          )}
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (
            <>
              Submitting
              <ProgressSpinner style={{ width: '20px', height: '20px', marginLeft: '10px' }} strokeWidth="3" />
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscribePage;
