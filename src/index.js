import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './Components/App/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



import "primereact/resources/themes/lara-light-cyan/theme.css";

import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


