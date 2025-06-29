import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const Statistics = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newSubscriptions, setNewSubscriptions] = useState(0);
  const [mostPopularPlan, setMostPopularPlan] = useState('');
  const [totalOrdersAmount, setTotalOrdersAmount] = useState(0);

  // Helper function to get amount based on plan type
  const getAmountForPlan = (planType) => {
    switch(planType) {
      case '3_Months':
        return 600.00;
      case '6_Months':
        return 1200.00;
      case '12_Months':
      case '1_Year':
      case '1 Year':
        return 1800.00;
      default:
        return 0.00;
    }
  };

  useEffect(() => {
    async function fetchRevenueAndStats() {
      try {
        const subsRes = await fetch(`${API_BASE_URL}/Subscribes/GetAllSubscribtions`);
        const subs = await subsRes.json();
        let revenue = 0;
        let newSubs = 0;
        let planCounts = {};
        if (Array.isArray(subs)) {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          subs.forEach(sub => {
            // احسب الإيرادات فقط للاشتراكات النشطة التي بدأت في الشهر الحالي
            if ((sub.status === 'Active' || sub.status === 1) && sub.startDate) {
              const date = new Date(sub.startDate);
              if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                revenue += getAmountForPlan(sub.subscriptionType);
                newSubs++;
              }
            }
            // عد الخطط
            if (sub.subscriptionType) {
              planCounts[sub.subscriptionType] = (planCounts[sub.subscriptionType] || 0) + 1;
            }
          });
        }
        let maxPlan = '';
        let maxCount = 0;
        for (const plan in planCounts) {
          if (planCounts[plan] > maxCount) {
            maxPlan = plan;
            maxCount = planCounts[plan];
          }
        }
        // ترجمة اسم الخطة
        const planLabels = {
          '3_Months': '3 Months',
          '6_Months': '6 Months',
          '12_Months': '1 Year',
          '1_Year': '1 Year',
          '1 Year': '1 Year'
        };
        setMostPopularPlan(planLabels[maxPlan] || maxPlan || 'N/A');
        setTotalRevenue(revenue);
        setNewSubscriptions(newSubs);
        const ordersRes = await fetch(`${API_BASE_URL}/Orders/GetAllOrders`);
        const orders = await ordersRes.json();
        let ordersTotal = 0;
        if (Array.isArray(orders)) {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          orders.forEach(order => {
            const date = new Date(order.orderDate || order.order_Date);
            if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              ordersTotal += Number(order.totalPrice) || 0;
            }
          });
        }
        setTotalOrdersAmount(ordersTotal);
      } catch {}
    }
    fetchRevenueAndStats();
  }, []);

  return (
    <div className="card border-0 shadow-sm h-100" style={{ minWidth: 420, maxWidth: 800, width: '100%', margin: '0 auto' }}>
      <div className="card-body d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-4" style={{fontWeight: 700, fontSize: 22}}>Quick Stats</h5>
        <div className="d-flex flex-column gap-3 w-100">
          {/* Revenue */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded stat-card" style={{background: 'rgba(39, 174, 96, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="stat-icon" style={{ background: '#27ae60' }}>
                <i className="fas fa-coins"></i>
              </span>
              <span className="stat-label">Total Subscription Revenue (This Month):</span>
            </span>
            <span className="stat-value" style={{ color: '#27ae60' }}>{totalRevenue.toLocaleString()} EGP</span>
          </div>
          {/* New Subscriptions */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded stat-card" style={{background: 'rgba(41, 128, 185, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="stat-icon" style={{ background: '#2980b9' }}>
                <i className="fas fa-plus-circle"></i>
              </span>
              <span className="stat-label">New Subscriptions (This Month):</span>
            </span>
            <span className="stat-value" style={{ color: '#2980b9' }}>{newSubscriptions}</span>
          </div>
          {/* Most Popular Plan */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded stat-card" style={{background: 'rgba(142, 68, 173, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="stat-icon" style={{ background: '#8e44ad' }}>
                <i className="fas fa-star"></i>
              </span>
              <span className="stat-label">Most Popular Plan:</span>
            </span>
            <span className="stat-value" style={{ color: '#8e44ad' }}>{mostPopularPlan}</span>
          </div>
          {/* Total Product Sales */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded stat-card" style={{background: 'rgba(255, 140, 0, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="stat-icon" style={{ background: '#ff8c00' }}>
                <i className="fas fa-shopping-cart"></i>
              </span>
              <span className="stat-label">Total Product Sales (This Month):</span>
            </span>
            <span className="stat-value" style={{ color: '#ff8c00' }}>{totalOrdersAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} EGP</span>
          </div>
        </div>
      </div>
      <style>{`
        .stat-card {
          min-height: 64px;
        }
        .stat-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border-radius: 50%;
          font-size: 20px;
        }
        .stat-label {
          font-weight: 600;
          font-size: 13px;
        }
        .stat-value {
          font-weight: 800;
          font-size: 17px;
          min-width: 90px;
          text-align: end;
        }
      `}</style>
    </div>
  );
};

export default Statistics; 