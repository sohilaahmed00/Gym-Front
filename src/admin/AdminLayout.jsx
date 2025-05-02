import React from 'react';
import SideList from './SideList';
import { Outlet } from 'react-router-dom';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <div className="d-flex">
        <SideList />
        <div className="flex-grow-1">
          <AdminTopbar />
          <div
            className="px-3 py-0"
            style={{
              minHeight: 'calc(100vh - 72px)',
              background: '#f6f8fa',
              fontFamily: 'inherit'
            }}
          >
           
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 