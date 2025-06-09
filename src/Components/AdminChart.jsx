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
          throw new Error('فشل في جلب البيانات');
        }
        
        const subscriptions = await res.json();
        
        if (!Array.isArray(subscriptions)) {
          throw new Error('تنسيق البيانات غير صحيح');
        }

        // معالجة البيانات
        const monthlyData = {};
        subscriptions.forEach(sub => {
          if (sub.startDate) {
            const date = new Date(sub.startDate);
            if (!isNaN(date.getTime())) {
              const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
            }
          }
        });

        // ترتيب الشهور
        const sortedMonths = Object.keys(monthlyData).sort();
        
        if (sortedMonths.length === 0) {
          throw new Error('لا توجد بيانات متاحة');
        }

        // حساب البيانات التراكمية
        let cumulative = 0;
        const cumulativeData = sortedMonths.map(month => {
          cumulative += monthlyData[month];
          return cumulative;
        });

        // تنسيق التسميات
        const formattedLabels = sortedMonths.map(month => {
          const [year, monthNum] = month.split('-');
          const date = new Date(year, parseInt(monthNum) - 1);
          return date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' });
        });

        setChartData({
          labels: formattedLabels,
          datasets: [{
            label: 'إجمالي الاشتراكات',
            data: cumulativeData,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4
          }]
        });
      } catch (error) {
        console.error('خطأ في جلب إحصائيات الاشتراكات:', error);
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
            family: "'Cairo', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: 'إحصائيات نمو الاشتراكات',
        font: {
          family: "'Cairo', sans-serif",
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: "'Cairo', sans-serif"
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Cairo', sans-serif"
          }
        }
      }
    }
  };

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="alert alert-danger mb-0">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">إحصائيات نمو الاشتراكات</h5>
              <div style={{ height: '400px' }}>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-muted">جاري تحميل البيانات...</div>
                  </div>
                ) : chartData.labels.length > 0 ? (
                  <Line options={chartOptions} data={chartData} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-muted">لا توجد بيانات متاحة</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChart; 