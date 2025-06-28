import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import styles from './ContactAdmin.module.css';
import { sendMailToAdmin } from '../../services/sendMailToAdmin';

export default function ContactAdmin({ role = 'coach' }) {
  const [message, setMessage] = useState('');
  const toast = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please enter a message.',
        life: 3000
      });
      return;
    }

    const result = await sendMailToAdmin(message, role);

    if (result.success) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Message sent successfully!',
        life: 3000
      });
      setMessage('');
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send message.',
        life: 3000
      });
    }
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      <h5>Contact Admin</h5>
      <textarea
        className={styles.textarea}
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        label="Send Mail"
        icon="pi pi-send"
        className="p-button-sm p-button-warning"
        onClick={handleSend}
      />
    </div>
  );
}
