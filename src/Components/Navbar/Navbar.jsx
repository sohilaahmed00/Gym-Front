import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useCart } from '../CartContext/CartContext';
import { checkLoginStatus, logout } from '../../services/IsLoggedIn';

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const { cart } = useCart(); 
  const { updateUserInCartContext } = useCart();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [fullName, setFullName] = useState(''); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedFullName = localStorage.getItem('fullName') || ''; 
    setFullName(storedFullName);
    setIsLoggedIn(checkLoginStatus());

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
       if (decoded?.roles?.length) {
      const userRole = decoded.roles[0];
      setRole(userRole);

      if (userRole === 'Admin') {
        navigate('/admin'); 
      }
    }
    }
  }, [location.pathname]);

  //hide navbar for admin page
  // if (location.pathname.startsWith('/admin')) {
  //   return null;
  // }

  const guestLinks = [
    { name: 'Home', icon: <i className="fa fa-home me-1"></i>, path: '/' },
    { name: 'Calories', icon: <i className="fa fa-calculator me-1"></i>, path: '/calories-calculator' },
    { name: 'Diet Plans', icon: <i className="fa fa-apple-alt me-1"></i>, path: '/nutrition-plan' },
    { name: 'Exercises', icon: <i className="fa fa-dumbbell me-1"></i>, path: '/exercises' },
    { name: 'Products', icon: <i className="fa fa-store me-1"></i>, path: '/products' },
    { name: 'Trainers', icon: <i className="fa fa-chalkboard-teacher me-1"></i>, path: '/coaches' },
    { name: 'Cart', icon: <i className="fa fa-shopping-cart me-1"></i>, path: '/cart' },
    { name: 'Login', icon: <i className="fa fa-sign-in-alt me-1"></i>, path: '/login' },
    { name: 'Sign Up', icon: <i className="fa fa-user-plus me-1"></i>, path: '/register' }
  ];

  const userLinks = [
    { name: 'Home', icon: <i className="fa fa-home me-1"></i>, path: '/' },
    { name: 'Calories', icon: <i className="fa fa-calculator me-1"></i>, path: '/calories-calculator' },
    { name: 'Diet Plans', icon: <i className="fa fa-apple-alt me-1"></i>, path: '/nutrition-plan' },
    { name: 'Trainers', icon: <i className="fa fa-chalkboard-teacher me-1"></i>, path: '/coaches' },
    { name: 'Exercises', icon: <i className="fa fa-dumbbell me-1"></i>, path: '/exercises' },
    { name: 'Products', icon: <i className="fa fa-store me-1"></i>, path: '/products' },
    { name: 'Dashboard', icon: <i className="fa fa-chart-bar me-1"></i>, path: '/user' }
  ];

  const coachLinks = [
    { name: 'Home', icon: <i className="fa fa-home me-1"></i>, path: '/' },
    // { name: 'Clients', icon: <i className="fa fa-users me-1"></i>, path: '/manage-clients' },
       { name: 'Products', icon: <i className="fa fa-store me-1"></i>, path: '/products' },

    { name: 'Manage Exercises', icon: <i className="fa fa-laptop-code me-1"></i>, path: '/exercises' },
    { name: 'Manage Diet', icon: <i className="fa fa-carrot me-1"></i>, path: '/nutrition-plan' },
    { name: 'Dashboard', icon: <i className="fa fa-chart-bar me-1"></i>, path: '/coach' }
  ];

 let links = guestLinks;
if (isLoggedIn) {
  if (role === 'Coach') links = coachLinks;
  else if (role === 'User') links = userLinks;
  else if (role === 'Admin') links = [...guestLinks, ...userLinks, ...coachLinks]; 
}


  const handleLogout = () => {
    logout(); 
    updateUserInCartContext();
    setIsLoggedIn(false); 
    navigate('/login'); 
  };

  return (
    <>
      <style>{`
        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px;
          background: linear-gradient(to right, #ff6600, #ff3300);
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
        }
        .nav-link:hover::after { transform: scaleX(1); }
        .navbar-brand:hover { opacity: 0.8; }
        .search-input {
          width: 200px; background-color: #444; border: none; color: #fff;
          transition: all 0.3s ease;
        }
        .search-input:hover { background-color: #ff6600; border-radius: 5px; }
        .user-name {
          background: linear-gradient(45deg, #F15B2A, #FF8C42);
          color: transparent; -webkit-background-clip: text;
          font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease;
        }
        .user-name:hover { opacity: 0.7; }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        padding: '0.8rem 1.5rem', zIndex: 1030,
        top: 0, left: 0, right: 0, width: '100%'
      }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-uppercase" to="/" style={{
            fontSize: '1.5rem', letterSpacing: '1px',
            background: 'linear-gradient(45deg, #F15B2A, #FF8C42)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s ease'
          }}>
            GYM MATE
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse w-100" id="navbarNav">
            <ul className="navbar-nav d-flex justify-content-center w-100">
              {links.map((link) => (
                <li className="nav-item" key={link.name}>
                  <Link className="nav-link text-white d-flex align-items-center" to={link.path}>
                    {link.icon} {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3">
              <Link to="/cart" className="position-relative text-white">
                <i className="fas fa-shopping-cart"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                  {cartItemCount}
                </span>
              </Link>
              {isLoggedIn && (
                <Link to={role === 'Coach' ? '/coach' : '/user'} className="user-name ms-3">
                  Welcome, {fullName}
                </Link>
              )}
              {isLoggedIn && (
                <button className="btn btn-link text-white d-flex justify-content-center align-items-center gap-1" onClick={handleLogout}>
                  <i className="fa fa-sign-out-alt me-1"></i> <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
