import React, { useEffect, useState } from 'react';

const Statistics = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newSubscriptions, setNewSubscriptions] = useState(0);
  const [mostPopularPlan, setMostPopularPlan] = useState('');

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
        // Get all subscriptions
        const subsRes = await fetch('http://gymmatehealth.runasp.net/api/Subscribes/GetAllSubscribtions');
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
        // استخراج أكثر خطة مستخدمة
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
      } catch {}
    }
    fetchRevenueAndStats();
  }, []);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-4" style={{fontWeight: 700, fontSize: 26}}>Quick Stats</h5>
        <div className="d-flex flex-column gap-3 w-100">
          {/* Revenue */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded" style={{background: 'rgba(39, 174, 96, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#27ae60', color: '#fff', borderRadius: '50%', fontSize: 26 }}>
                <i className="fas fa-coins"></i>
              </span>
              <span style={{fontWeight: 600, fontSize: 18}}>Total Subscription Revenue (EGP):</span>
            </span>
            <span style={{fontWeight: 800, color: '#27ae60', fontSize: 26}}>{totalRevenue.toLocaleString()}</span>
          </div>
          {/* New Subscriptions */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded" style={{background: 'rgba(41, 128, 185, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#2980b9', color: '#fff', borderRadius: '50%', fontSize: 26 }}>
                <i className="fas fa-plus-circle"></i>
              </span>
              <span style={{fontWeight: 600, fontSize: 18}}>New Subscriptions (This Month):</span>
            </span>
            <span style={{fontWeight: 800, color: '#2980b9', fontSize: 26}}>{newSubscriptions}</span>
          </div>
          {/* Most Popular Plan */}
          <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded" style={{background: 'rgba(142, 68, 173, 0.08)'}}>
            <span className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#8e44ad', color: '#fff', borderRadius: '50%', fontSize: 26 }}>
                <i className="fas fa-star"></i>
              </span>
              <span style={{fontWeight: 600, fontSize: 18}}>Most Popular Plan:</span>
            </span>
            <span style={{fontWeight: 800, color: '#8e44ad', fontSize: 26}}>{mostPopularPlan}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 