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
import CoachDashboard from '../../coach/CoashDashboard';
import CoachStats from '../../coach/pages/CoachStats';
import ExpiredSubscribers from '../../coach/pages/ExpiredSubscribers';
import SubscriberDetails from '../../coach/pages/SubscriberDetails';
import ExpiredSubscriberDetails from '../../coach/pages/ExpiredSubscriberDetails';
import UserDashboard from '../../UserProfile/UserDashboard';
import UserHome from '../../UserProfile/pages/UserHome';
import TrainingSchedule from '../../UserProfile/pages/TrainingSchedule';
import DietPlan from '../../UserProfile/pages/DietPlan';

import Coaches from '../Coaches/Coaches';
import CoachProfile from '../CoachProfile/CoachProfile';
import CaloriesCalculator from '../CaloriesCalculator/CaloriesCalculator';
import Register from '../Register/Register';
import Login from '../Login/Login';

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
      { path: 'coaches', element: <Coaches /> },
      { path: 'coach/:id', element: <CoachProfile /> },
      { path: 'calories-calculator', element: <CaloriesCalculator /> },
      {path: 'sign-up', element: <Register />},
      {path: 'login', element: <Login />},
    ],
  },
  {
    path: '/coach',
    element: <CoachDashboard />,
    children: [
      { index: true, element: <CoachStats /> },
      { path: 'expired', element: <ExpiredSubscribers /> },
      { path: 'subscriber/:id', element: <SubscriberDetails /> },
      {
        path: '/coach/expired/:id',
        element: <ExpiredSubscriberDetails />
      }
    ],
  },
  {
    path: '/user',
    element: <UserDashboard />,
    children: [
      { index: true, element: <UserHome /> },
      { path: 'schedule', element: <TrainingSchedule  /> },
      { path: 'diet', element: <DietPlan /> },
      // { path: 'chat', element: <ChatWithCoach /> },
    ]
  }
]);

function App() {
  return (
    <CartProvider>
      <RouterProvider router={routes} />
    </CartProvider>
  );
}

export default App;
