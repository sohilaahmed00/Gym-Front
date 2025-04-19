import React from 'react';
import { Link } from 'react-router-dom';
import style from '../Footer/Footer.module.css'; // Assuming you'll create a CSS module for styling

export default function Footer() {
  return (
    <footer className={`${style.footer} bg-light py-3`}>
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        {/* Left Section: Copyright */}
        <div className="text-muted">
          <span>&copy; 2024 SHIPON. All rights reserved.</span>
        </div>

        {/* Center Section: Links */}
        <div className="d-flex gap-3">
          <Link className={style.footerLink} to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className={style.footerLink} to="/terms-of-service">
            Terms of Service
          </Link>
          <Link className={style.footerLink} to="/cookies-settings">
            Cookies Settings
          </Link>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="d-flex gap-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f fa-lg" style={{ color: '#FF5722' }}></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-lg" style={{ color: '#FF5722' }}></i>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-x-twitter fa-lg" style={{ color: '#FF5722' }}></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in fa-lg" style={{ color: '#FF5722' }}></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube fa-lg" style={{ color: '#FF5722' }}></i>
          </a>
        </div>
      </div>
    </footer>
  );
}