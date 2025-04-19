import React from 'react';
import styles from '../Contacts/Contacts.module.css';
import contactImage from '../images/Placeholder Image1.png';

export default function Contacts() {
  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <div className={styles.formSection}>
          <h1>Get in Touch with FitLife Studio</h1>
          <p>We're Here to Help You on Your Fitness Journey. Reach Out to Us with Any Questions or to Schedule a Visit!</p>
          
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="4" placeholder="Type your message..." required></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input type="checkbox" name="terms" required />
                <span>I accept the Terms</span>
              </label>
            </div>
            
            <button type="submit" className={styles.submitButton}>Submit Now</button>
          </form>
        </div>
        
        <div className={styles.imageSection}>
          <img src={contactImage} alt="Contact support" />
        </div>
      </div>

      <div className={styles.contactInfo}>
        <div className={styles.infoCard}>
          <div className={styles.icon}>
            <i className="far fa-envelope"></i>
          </div>
          <h3>Email</h3>
          <p>For Inquiries and Support, Reach Out to Us</p>
          <a href="mailto:info@fitlifestudio.com">info@fitlifestudio.com</a>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.icon}>
            <i className="far fa-comment-dots"></i>
          </div>
          <h3>Live Chat</h3>
          <p>Chat with Us Live for Immediate Assistance and Support</p>
          <a href="#">(123) 456-7890</a>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.icon}>
            <i className="fas fa-phone"></i>
          </div>
          <h3>Phone</h3>
          <p>Speak with Our Team Directly</p>
          <a href="tel:1234567890">(123) 456-7890</a>
        </div>
      </div>
    </div>
  );
}
