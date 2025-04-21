import React from 'react';
import { Dialog } from 'primereact/dialog';

const SubscriptionModal = ({ visible, onHide }) => {
  return (
    <Dialog
      header="📄 Plan Details"
      visible={visible}
      style={{ width: '30vw' }}
      onHide={onHide}
      breakpoints={{ '960px': '75vw', '640px': '90vw' }}
    >
      <p><strong>Plan:</strong> Gold Plan</p>
      <p><strong>Duration:</strong> 3 Months</p>
      <p><strong>Type:</strong> System Training (coach-assigned)</p>
      <p><strong>Includes:</strong></p>
      <ul>
        <li>✔️ 3 workouts per week</li>
        <li>✔️ Weekly feedback</li>
        <li>✔️ Diet plan updates</li>
        <li>✔️ Access to coach chat</li>
      </ul>
    </Dialog>
  );
};

export default SubscriptionModal;
