import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserTypePieChart = () => {
  const [data, setData] = useState({
    labels: ['Users with Subscription', 'Normal Users'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          'rgba(46, 204, 113, 0.7)',
          'rgba(52, 152, 219, 0.7)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)'
        ],
        borderWidth: 2
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        // Get all users
        const usersRes = await fetch('http://gymmatehealth.runasp.net/api/Users/GetAllUsers');
        const users = await usersRes.json();
        // Get all subscriptions
        const subsRes = await fetch('http://gymmatehealth.runasp.net/api/Subscribes/GetAllSubscribtions');
        const subs = await subsRes.json();
        if (!Array.isArray(users) || !Array.isArray(subs)) {
          throw new Error('Invalid data format');
        }
        // Build a set of userIds who have at least one subscription
        const subscribedUserIds = new Set(subs.map(sub => sub.userId));
        // Count users with and without subscription
        let withSub = 0;
        let normal = 0;
        users.forEach(user => {
          if (user.userId && subscribedUserIds.has(user.userId)) {
            withSub++;
          } else if (user.userId) {
            normal++;
          }
        });
        setData({
          labels: ['Users with Subscription', 'Normal Users'],
          datasets: [
            {
              data: [withSub, normal],
              backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)'
              ],
              borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(52, 152, 219, 1)'
              ],
              borderWidth: 2
            }
          ]
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const options = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 13
          }
        }
      },
      title: {
        display: true,
        text: 'User Types Distribution',
        font: {
          family: "'Poppins', sans-serif",
          size: 15,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-3">
        {loading ? (
          <div className="text-center text-muted">Loading...</div>
        ) : (
          <div style={{ height: 250 }}>
            <Doughnut data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTypePieChart; 