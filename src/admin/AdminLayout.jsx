import React, { useEffect, useState } from 'react';
import SideList from './SideList';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminLayout() {
  const [pendingCoachesCount, setPendingCoachesCount] = useState(0);
  const [pendingSubscriptionsCount, setPendingSubscriptionsCount] = useState(0);

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
    <div style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <div className="d-flex">
        <SideList pendingCoachesCount={pendingCoachesCount} pendingSubscriptionsCount={pendingSubscriptionsCount} />
        <div className="flex-grow-1">
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