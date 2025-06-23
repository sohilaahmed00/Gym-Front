import React, { useEffect, useState } from 'react';
import SideList from './SideList';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminLayout() {
  const [pendingCoachesCount, setPendingCoachesCount] = useState(0);
  const [pendingSubscriptionsCount, setPendingSubscriptionsCount] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // جلب عدد المدربين المعلقين
    const fetchPendingCoaches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Coaches/AllUnapprovedCoaches`);
        setPendingCoachesCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch {
        setPendingCoachesCount(0);
      }
    };
    fetchPendingCoaches();
    // جلب عدد الاشتراكات المعلقة
    const fetchPendingSubscriptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Subscribes/GetAllpendingsubscriptions`);
        setPendingSubscriptionsCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch {
        setPendingSubscriptionsCount(0);
      }
    };
    fetchPendingSubscriptions();
  }, []);

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh', position: 'relative' }}>
      <style>{`
        .admin-sidebar {
          transition: transform 0.3s ease-in-out;
        }
        @media (max-width: 991.98px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 1030;
            transform: translateX(-100%);
          }
          .admin-sidebar.is-open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1020;
          }
        }
        .sidebar-toggle-btn {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 10;
        }
      `}</style>
      
      {isSidebarOpen && <div className="sidebar-overlay d-lg-none" onClick={() => setSidebarOpen(false)}></div>}

      <div className="d-flex">
        <SideList 
          pendingCoachesCount={pendingCoachesCount} 
          pendingSubscriptionsCount={pendingSubscriptionsCount}
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="flex-grow-1">
          <button className="btn d-lg-none sidebar-toggle-btn" onClick={() => setSidebarOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
          <div
            className="px-3 py-0"
            style={{
              minHeight: '100vh',
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