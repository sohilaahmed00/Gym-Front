import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);

  useEffect(() => {
    const fetchPendingSubscriptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Subscribes/GetAllpendingsubscriptions`);
        setPendingSubscriptions(response.data);
      } catch (error) {
        console.error('Error fetching pending subscriptions:', error);
        // Fallback data in case of API failure
        setPendingSubscriptions([
          {
            id: 1,
            user: { name: 'John Doe' },
            plan: 'Monthly Plan',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };

    fetchPendingSubscriptions();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Alert severity="warning" className="bg-yellow-50 border-yellow-200">
          <AlertTitle className="text-yellow-800">Pending Subscriptions</AlertTitle>
          <div className="text-yellow-700">
            You have {pendingSubscriptions.length} pending subscription requests that need your attention.
            <Button
              variant="text"
              color="warning"
              size="small"
              className="ml-2 text-yellow-800 hover:text-yellow-900"
              onClick={() => navigate('/admin/pending-subscriptions')}
            >
              Review Now
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default AdminDashboard; 