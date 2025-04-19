import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Navbar from '../Navbar/Navbar';
import Home from '../Home/Home';
import About from '../About/About';
import Contacts from '../Contacts/Contacts';
import Exercises from '../Exercises/Exercises';
import { CartProvider } from '../CartContext/CartContext';
import Products from '../Products/Products';
import Cart from '../Cart/Cart';
import ProductDetails from '../ProductDetails/ProductDetails';
import Checkout from '../Checkout/Checkout';
import MasterLayout from '../MasterLayout/MasterLayout';
import NotFound from '../NotFound/NotFound';


const routes = createBrowserRouter([
  {
    path: '/',
    element: <MasterLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'products', element: <Products /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'exercises', element: <Exercises /> },
    ],
  },
]);


function App() {
  return (
    <CartProvider>
      <RouterProvider router={routes} />
    </CartProvider>
  );
}

export default App;
