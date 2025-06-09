import React from 'react';
import { Link } from 'react-router-dom';
import style from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContent}>
        {/* Company Info Section */}
        <div className={style.footerSection}>
          <h3 className={style.footerTitle}>GYM MATE</h3>
          <p className={style.footerDescription}>
            Your ultimate fitness companion. We provide personalized training programs,
            nutrition plans, and expert coaching to help you achieve your fitness goals.
          </p>
          <div className={style.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={style.socialLink}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className={style.footerSection}>
          <h3 className={style.footerTitle}>Quick Links</h3>
          <ul className={style.footerLinks}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contacts">Contact Us</Link></li>
            <li><Link to="/exercises">Exercises</Link></li>
            <li><Link to="/coaches">Our Coaches</Link></li>
            <li><Link to="/products">Products</Link></li>
          </ul>
        </div>

        {/* Services Section */}
        <div className={style.footerSection}>
          <h3 className={style.footerTitle}>Our Services</h3>
          <ul className={style.footerLinks}>
            <li><Link to="/nutrition-plan">Nutrition Plans</Link></li>
            <li><Link to="/calories-calculator">Calories Calculator</Link></li>
            <li><Link to="/PricingPlans">Subscription Plans</Link></li>
            <li><Link to="/exercises">Workout Programs</Link></li>
            <li><Link to="/coaches">Personal Training</Link></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className={style.footerSection}>
          <h3 className={style.footerTitle}>Contact Info</h3>
          <ul className={style.contactInfo}>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Fitness Street, Cairo, Egypt</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+20 123 456 7890</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@gymmate.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={style.copyright}>
        <div className={style.copyrightContent}>
          <p>&copy; {new Date().getFullYear()} GYM MATE. All rights reserved.</p>
          <div className={style.legalLinks}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}