import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext'; // Import useCart to access the cart state
import style from './Navbar.module.css';

export default function Navbar() {
  const { cart } = useCart(); // Get the cart from CartContext

  // Calculate the total number of items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <span style={{ color: '#ff5c1f', fontSize: '20px', marginRight: '5px' }}>🏋️‍♂️</span>
          FitLife Studio
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-bold" style={{ color: '#FF5722' }} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/exercises">
                Exercises
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacts">
                Contact
              </Link>
            </li>
          </ul>

          <Link to="/cart" className="position-relative me-3">
            <i className="fas fa-shopping-cart fa-lg" style={{ color: '#333' }}></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-orange"
              style={{ backgroundColor: '#FF5722', fontSize: '12px' }}
            >
              {cartItemCount} {/* Display the dynamic cart item count */}
            </span>
          </Link>

          <Link
            className="btn text-white fw-bold px-4 rounded-pill"
            to="/sign-up"
            style={{ backgroundColor: '#FF5722' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}