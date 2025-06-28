import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SideList from './SideList'
import ManageCoaches from './ManageCoaches'
import ManageUsers from './ManageUsers'
import ManageProducts from './ManageProducts'
import ManageClients from './ManageClients'
import ManageSubscriptions from './ManageSubscriptions'
import PendingSubscriptions from './PendingSubscriptions'
import PendingCoaches from './PendingCoaches'
import ExerciseCategories from './ExerciseCategories'
import AdminChart from './AdminChart'
import Statistics from './Statistics'
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../config'
// import UserTypePieChart from './UserTypePieChart'

function Admin() {
  const navigate = useNavigate();
  // الإحصائيات الديناميكية
  const [stats, setStats] = useState({
    coaches: 0,
    clients: 0,
    products: 0,
    subscriptions: 0
  });
  // أرقام التنبيهات الديناميكية
  const [pendingCoachesCount, setPendingCoachesCount] = useState(0);
  const [pendingSubscriptionsCount, setPendingSubscriptionsCount] = useState(0);
  // الإشعارات (يمكنك تعديلها لاحقاً لتكون ديناميكية أيضاً)
  const notifications = [
    { id: 1, text: `${pendingCoachesCount} coaches pending approval`, type: 'warning', link: '/admin/pending-coaches' },
    { id: 2, text: `${pendingSubscriptionsCount} subscriptions need review`, type: 'info', link: '/admin/pending-subscriptions' },
  ];
  // Quick actions
  const quickActions = [
    { label: 'Add Coach', icon: 'fas fa-user-plus', link: '/admin/coaches' },
    { label: 'Add Client', icon: 'fas fa-user-friends', link: '/admin/clients' },
    { label: 'Add Product', icon: 'fas fa-box', link: '/admin/products' },
  ];
  // Recent activities (dummy)
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, desc: 'New subscription added', date: '2024-06-01' },
    { id: 2, desc: 'New coach reviewed', date: '2024-05-30' },
    { id: 3, desc: 'Product added', date: '2024-05-29' },
    { id: 4, desc: 'Client added', date: '2024-05-28' },
    { id: 5, desc: 'Coach data updated', date: '2024-05-27' },
  ]);
  const [recentCoaches, setRecentCoaches] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newSubscriptions, setNewSubscriptions] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [mostPopularPlan, setMostPopularPlan] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('recentActivities');
    if (stored) {
      try {
        setRecentActivities(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    async function fetchCoaches() {
      try {
        const res = await fetch(`${API_BASE_URL}/Coaches/GetAllCoaches`);
        const data = await res.json();
        const sorted = [...data].sort((a, b) => new Date(b.createdAt || b.addedDate || b.date || 0) - new Date(a.createdAt || a.addedDate || a.date || 0));
        setRecentCoaches(sorted.slice(0, 5));
      } catch {}
    }
    fetchCoaches();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_BASE_URL}/Users/GetAllUsers`);
        const data = await res.json();
        const sorted = [...data].sort((a, b) => new Date(b.createdAt || b.addedDate || b.date || 0) - new Date(a.createdAt || a.addedDate || a.date || 0));
        setRecentUsers(sorted.slice(0, 5));
      } catch {}
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchPendingCounts() {
      try {
        // جلب المدربين المعلقين من API الكوتشات المعلقة مباشرة
        const coachesRes = await fetch(`${API_BASE_URL}/Coaches/AllUnapprovedCoaches`);
        const coaches = await coachesRes.json();
        setPendingCoachesCount(coaches.length);

        // جلب الاشتراكات المعلقة
        const subsRes = await fetch(`${API_BASE_URL}/Subscribes/GetAllSubscribtions`);
        const subs = await subsRes.json();
        // عدل حسب اسم الحقل والقيمة الفعلية للحالة المعلقة
        const pendingSubs = subs.filter(sub => sub.status === 'pending' || sub.status === 0);

        setPendingSubscriptionsCount(pendingSubs.length);
      } catch {
        setPendingCoachesCount(0);
        setPendingSubscriptionsCount(0);
      }
    }
    fetchPendingCounts();
  }, []);

  // جلب الإحصائيات من الـAPI
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coachesRes, usersRes, productsRes, subsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/Coaches/GetAllCoaches`),
          fetch(`${API_BASE_URL}/Users/GetAllUsers`),
          fetch(`${API_BASE_URL}/Products/GetAllProducts`),
          fetch(`${API_BASE_URL}/Subscribes/GetAllSubscribtions`),
        ]);
        const [coaches, users, products, subscriptions] = await Promise.all([
          coachesRes.json(), usersRes.json(), productsRes.json(), subsRes.json()
        ]);
        setStats({
          coaches: Array.isArray(coaches) ? coaches.length : 0,
          clients: Array.isArray(users) ? users.length : 0,
          products: Array.isArray(products) ? products.length : 0,
          subscriptions: Array.isArray(subscriptions)
            ? subscriptions.filter(sub => sub.status === 'Active' && sub.isApproved).length
            : 0
        });
      } catch {
        setStats({ coaches: 0, clients: 0, products: 0, subscriptions: 0 });
      }
    };
    fetchStats();
  }, []);

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
            // احسب المبلغ بناءً على نوع الخطة
            revenue += getAmountForPlan(sub.subscriptionType);
            // احسب الاشتراكات الجديدة هذا الشهر
            if (sub.startDate) {
              const date = new Date(sub.startDate);
              if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
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
        // Get all users for new users this month
        const usersRes = await fetch(`${API_BASE_URL}/Users/GetAllUsers`);
        const users = await usersRes.json();
        let newUsersCount = 0;
        if (Array.isArray(users)) {
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          users.forEach(user => {
            if (user.createdAt) {
              const date = new Date(user.createdAt);
              if (!isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                newUsersCount++;
              }
            }
          });
        }
        setNewUsers(newUsersCount);
      } catch {}
    }
    fetchRevenueAndStats();
  }, []);

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh'  }}>
      <div className="container py-4">
        {/* Title, welcome, and notifications in the same row */}
        <div className="row align-items-center mb-4">
          <div className="col-md-8 col-12 mb-2 mb-md-0">
            <h2 className="fw-bold mb-1">Welcome to the Admin Dashboard</h2>
            <p className="text-muted mb-0">Manage your website efficiently and easily.</p>
          </div>
          <div className="col-md-4 col-12 d-flex justify-content-md-end justify-content-center">
            <div className="d-flex flex-column align-items-end gap-2 w-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`alert alert-${notif.type} mb-0 d-flex align-items-center gap-2 py-2 px-3`}
                  style={{ cursor: 'pointer', minWidth: 220, textAlign: 'right' }}
                  onClick={() => navigate(notif.link)}
                >
                  <i className="fas fa-bell"></i>
                  <span>{notif.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm bg-primary bg-opacity-10 h-100 hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/coaches')}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <div className="fw-bold fs-5">{stats.coaches}</div>
                  <div className="text-muted small">Coaches</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm bg-info bg-opacity-10 h-100 hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/clients')}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div className="fw-bold fs-5">{stats.clients}</div>
                  <div className="text-muted small">Clients</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm bg-success bg-opacity-10 h-100 hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <i className="fas fa-dumbbell"></i>
                </div>
                <div>
                  <div className="fw-bold fs-5">{stats.products}</div>
                  <div className="text-muted small">Available Products</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm bg-warning bg-opacity-10 h-100 hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/subscriptions')}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                  <i className="fas fa-id-card"></i>
                </div>
                <div>
                  <div className="fw-bold fs-5">{stats.subscriptions}</div>
                  <div className="text-muted small">Active Subscriptions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="row mb-4">
          <div className="col-lg-6 col-md-8 col-12 ms-auto">
            <AdminChart />
          </div>
          <div className="col-lg-6 col-md-4 col-12 me-auto">
            <Statistics />
          </div>
        </div>

        {/* Activities and chart row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Latest Coaches</h5>
                <ul className="list-group list-group-flush">
                  {recentCoaches.length === 0 ? (
                    <li className="list-group-item text-center text-muted">No coaches found.</li>
                  ) : recentCoaches.map((coach) => (
                    <li key={coach.userId} className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-2">
                        {coach.image ? (
                          <img src={`${API_BASE_IMAGE_URL}/images/profiles/${coach.image}`} alt={coach.fullName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', color: '#888', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                            <i className="fas fa-user-tie"></i>
                          </span>
                        )}
                        <span style={{ fontWeight: 600 }}>{coach.fullName}</span>
                      </span>
                      <span className="badge bg-light text-dark">{coach.createdAt ? coach.createdAt.slice(0, 10) : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Latest Users</h5>
                <ul className="list-group list-group-flush">
                  {recentUsers.length === 0 ? (
                    <li className="list-group-item text-center text-muted">No users found.</li>
                  ) : recentUsers.map((user) => (
                    <li key={user.userId} className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="d-flex align-items-center gap-2">
                        {user.image ? (
                          <img src={`${API_BASE_IMAGE_URL}/images/profiles/${user.image}`} alt={user.fullName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', color: '#888', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                            <i className="fas fa-user"></i>
                          </span>
                        )}
                        <span style={{ fontWeight: 600 }}>{user.fullName}</span>
                      </span>
                      <span className="badge bg-light text-dark">{user.createdAt ? user.createdAt.slice(0, 10) : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hover-bg-light:hover { background: #f1f3f6; }
      `}</style>
      {/* FontAwesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  )
}

export default Admin;