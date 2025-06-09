import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriptionStats() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('http://gymmatehealth.runasp.net/api/Subscribes/GetAllSubscribtions');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const subscriptions = await res.json();
        
        if (!Array.isArray(subscriptions)) {
          throw new Error('Invalid data format');
        }

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Initialize daily data
        const dailyData = Array(daysInMonth).fill(0);

        // Count subscriptions per day for current month
        subscriptions.forEach(sub => {
          if (sub.startDate) {
            const date = new Date(sub.startDate);
            if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              const day = date.getDate(); // 1-based
              dailyData[day - 1] += 1;
            }
          }
        });

        // Labels: 1, 2, ..., daysInMonth
        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

        setChartData({
          labels,
          datasets: [{
            label: 'Subscriptions per Day',
            data: dailyData,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
          }]
        });
      } catch (error) {
        console.error('Error fetching subscription stats:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionStats();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          padding: 10
        }
      },
      title: {
        display: true,
        text: 'Subscriptions per Day (Current Month)',
        font: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: '500'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2c3e50',
        bodyColor: '#34495e',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 10,
        titleFont: {
          size: 12,
          weight: '600',
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 11,
          family: "'Poppins', sans-serif"
        },
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Subscriptions: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: "'Poppins', sans-serif",
            size: 10
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 10
          },
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-3">
          <div className="alert alert-danger mb-0 py-2">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-3">
        <div style={{ height: '380px' }}>
          {loading ? (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-muted small">Loading data...</div>
            </div>
          ) : chartData.labels.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-muted small">No data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChart; 