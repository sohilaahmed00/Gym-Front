import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const UserDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor: '#f9f9fb', padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;
