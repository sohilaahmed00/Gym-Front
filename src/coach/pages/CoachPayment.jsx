import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CoachPayments.module.css';

const subscriptionPrices = {
  '3_Months': 600,
  '6_Months': 1200,
  '1_Year': 1800
};

const CoachPayments = () => {
  const coachId = localStorage.getItem('id');
  const [subs, setSubs] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [paidMonths, setPaidMonths] = useState([]); 

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await axios.get(`http://gymmatehealth.runasp.net/api/Subscribes/coach/${coachId}`);
      setSubs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const groupByMonth = (data) => {
    return data.reduce((acc, sub) => {
      const month = new Date(sub.startDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(sub);
      return acc;
    }, {});
  };

  const handleSaveMethod = async () => {
    if (!paymentMethod || !paymentDetails) {
      setSubmitMessage('❌ Please complete all payment fields');
      return;
    }

    try {
      await axios.post('http://gymmatehealth.runasp.net/api/Coach/SavePaymentMethod', {
        coachId,
        method: paymentMethod,
        details: paymentDetails
      });
      setSubmitMessage('✅ Payment method saved successfully');
    } catch (error) {
      console.error(error);
      setSubmitMessage('❌ Failed to save payment method');
    }
  };

  const monthlyGroups = groupByMonth(subs);

  return (
    <div className={`container ${styles.paymentsContainer}`}>
      <h2 className={styles.title}>💰 Your Earnings</h2>

      <div className={styles.methodSection}>
  <label>Preferred Payment Method:</label>

  <select
    className={styles.select}
    value={paymentMethod}
    onChange={e => setPaymentMethod(e.target.value)}
  >
    <option value="">Select</option>
    <option value="vodafonecash">Vodafone Cash</option>
    <option value="instapay">InstaPay</option>
    <option value="fawry">Fawry</option>
  </select>

  {paymentMethod && (
    <input
      type="text"
      className={styles.detailsInput}
      placeholder={
        paymentMethod === 'vodafonecash'
          ? 'Enter Vodafone number'
          : paymentMethod === 'instapay'
          ? 'Enter InstaPay username or number'
          : 'Enter Fawry code'
      }
      value={paymentDetails}
      onChange={e => setPaymentDetails(e.target.value)}
    />
  )}

  <button className={styles.saveBtn} onClick={handleSaveMethod}>
    Save Method
  </button>

  {submitMessage && <span className={styles.message}>{submitMessage}</span>}
</div>

      <hr />

      {Object.keys(monthlyGroups).map((month, idx) => {
        const monthlySubs = monthlyGroups[month];
        const total = monthlySubs.reduce((acc, sub) => acc + (subscriptionPrices[sub.subscriptionType] * 0.2), 0).toFixed(2);
        const isPaid = idx === 0 ? false : true; // Example logic – adjust when integrating real payment status.

        return (
          <div key={month} className={styles.monthSection}>
            <h4>{month}</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subscription</th>
                  <th>Price</th>
                  <th>Your Earning</th>
                </tr>
              </thead>
              <tbody>
                {monthlySubs.map((sub, i) => (
                  <tr key={i}>
                    <td>{sub.userName}</td>
                    <td>{sub.subscriptionType.replace('_', ' ')}</td>
                    <td>{subscriptionPrices[sub.subscriptionType]} EGP</td>
                    <td>{(subscriptionPrices[sub.subscriptionType] * 0.2).toFixed(2)} EGP</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total for {month}:</strong></td>
                  <td><strong>{total} EGP</strong></td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <span className={isPaid ? styles.paid : styles.pending}>
                      {isPaid ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default CoachPayments;
