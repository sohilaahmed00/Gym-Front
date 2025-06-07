import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
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
import NutritionPlan from '../NutritionPlan/NutritionPlan';
import Coaches from '../Coaches/Coaches';
import CoachProfile from '../CoachProfile/CoachProfile';
import CaloriesCalculator from '../CaloriesCalculator/CaloriesCalculator';
import CoachSettings from '../../coach/pages/CoachSetting';
import Payment from '../Payment/Payment';
import PricingPlans from '../Home/PricingPlans/PricingPlans';
import ExerciseDetails from '../ExerciseDetails/ExerciseDetails';

// Admin
import Admin from '../../admin/Admin';
import ManageCoaches from '../../admin/ManageCoaches';
import ManageUsers from '../../admin/ManageUsers';
import AdminLayout from '../../admin/AdminLayout';
import ManageProducts from '../../admin/ManageProducts';
import PendingSubscriptions from '../../admin/PendingSubscriptions';
import RejectedSubscriptions from '../../admin/RejectedSubscriptions';
import AdminSettings, { AccountSettings, SiteSettings, PaymentSettings, SystemSettings, ContentSettings } from '../../admin/AdminSettings';
import PendingCoaches from '../../admin/PendingCoaches';
import ManageSubscriptions from '../../admin/ManageSubscriptions';
import ExerciseCategories from '../../admin/ExerciseCategories';
import AdminExercises from '../../admin/AdminExercises';





import Login from '../Auth/login/Login';
import ConfirmMail from '../Auth/confirm-mail/ConfirmMail';
import CompleteProfile from '../Auth/complete-profile/CompleteProfile';
import Register from '../Auth/Register/Register';
import ForgotPassword from '../Auth/forget-password/ForgetPassword';
import EnterOtp from '../Auth/NewPassword-OTP/OTP-Page';
import ResetPassword from '../Auth/reset-password/ResetPassword';


import "primereact/resources/themes/lara-light-cyan/theme.css";
import UserSettings from '../../UserProfile/pages/UserSettings';
import SubscribePage from '../subscribe/SubscribePage';
import DietPlan from '../../UserProfile/pages/DietPlan';
import ServiceDetails from '../../pages/ServiceDetails/ServiceDetails';
import ChatBot from '../../UserProfile/pages/ChatBot';
<<<<<<< HEAD
=======
import AdminExercises from '../../admin/AdminExercises';
import IntroTour from '../IntroJs/IntroTour';

>>>>>>> e8764ba6b06336f20320cc4426b4c704cc9c3752
function Placeholder({ title }) {
  return <div className="p-5 text-center"><h2>{title} Page (Coming Soon)</h2></div>;
}

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
      { path: 'exercise/:id', element: <ExerciseDetails /> },
      { path: 'coaches', element: <Coaches/> },
      { path: 'coach/:id', element: <CoachProfile /> },
      { path: 'PricingPlans', element: <PricingPlans /> },
      { path: 'subscribe', element: <SubscribePage /> },
      { path: 'calories-calculator', element: <CaloriesCalculator /> },
      { path: 'nutrition-plan', element: <NutritionPlan /> },
      { path: 'services/:serviceName', element: <ServiceDetails /> },
      { path: 'register', element: <Register />},
      { path: 'confirm-mail', element: <ConfirmMail />},
      { path: 'complete-profile', element: <CompleteProfile />},
      {path:  '/forgot-password' ,element:<ForgotPassword /> },
      { path: "/enter-otp" , element: <EnterOtp />},
      { path: "/reset-password" , element: <ResetPassword />},
      { path: 'login', element: <Login />},
      { path: 'payment', element: <Payment />},

      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Admin /> },
          { path: 'coaches', element: <ManageCoaches /> },
          { path: 'clients', element: <ManageUsers /> },
          { path: 'products', element:<ManageProducts /> },
          { path: 'subscriptions', element: <ManageSubscriptions /> },
          { path: 'orders', element: <Placeholder title="Orders" /> },
          { path: 'reports', element: <Placeholder title="Reports" /> },
          { path: 'exercise-categories', element: <ExerciseCategories /> },
          // { path: 'exercises/:categoryId', element: <ADExercises /> },
          { path: 'exercises', element: <AdminExercises /> },

          {
            path: 'settings',
            element: <AdminSettings />,
            children: [
              { index: true, element: <AccountSettings /> },
              { path: 'account', element: <AccountSettings /> },
              { path: 'site', element: <SiteSettings /> },
              { path: 'payment', element: <PaymentSettings /> },
              { path: 'system', element: <SystemSettings /> },
              { path: 'content', element: <ContentSettings /> },
            ]
          },
          { path: 'pending-subscriptions', element: <PendingSubscriptions /> },
          { path: 'rejected-subscriptions', element: <RejectedSubscriptions /> },
          { path: 'pending-coaches', element: <PendingCoaches /> },
        ]
      },
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
      },
      {
       path: 'setting',
       element: <CoachSettings /> 
      },

    ],
  },
  {
    
  },
  {
    path: '/coach',
    element: <CoachDashboard />,
    children: [
      { index: true, element: <CoachStats /> },
      { path: 'expired', element: <ExpiredSubscribers /> },
      { path: 'subscriber/:id', element: <SubscriberDetails /> },
      {path:'exercise', element:<Exercises/>},
      {path:'products', element:<Products/>},

      {
        path: '/coach/expired/:id',
        element: <ExpiredSubscriberDetails />
      },
      {
       path: 'setting',
       element: <CoachSettings /> 
      },

    ],
  },
  {
    path: '/user',
    element: <UserDashboard />,
    children: [
      { index: true, element: <UserHome /> },
      { path: 'schedule', element: <TrainingSchedule  /> },
      { path: 'diet', element: <DietPlan/> },
      { path: "settings", element: <UserSettings />},
      { path: 'chat', element: <ChatBot /> },
     { path: "settings", element: <UserSettings />}

      // { path: 'chat', element: <ChatWithCoach /> },
    ]
  }
]);



function App() {
  return (
    <CartProvider>
       <IntroTour />
      <RouterProvider router={routes} />
    </CartProvider>
  );
}

export default App;