import React from 'react';
import Sidebar from './components/Sidebar';
import {  Outlet, useNavigate } from 'react-router-dom';

const CoachDashboard = () => {
    const navigate =useNavigate()
    const handleSubscriberSelect = (id) => {
        navigate(`/coach/subscriber/${id}`);
      };
      
  return (
    <div>
       <Sidebar onSubscriberSelect={handleSubscriberSelect} />
      <div
        className="p-4"
        style={{
          marginLeft: '250px', // نفس عرض السايدبار
          background: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default CoachDashboard;
