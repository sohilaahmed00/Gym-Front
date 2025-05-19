import React from 'react'
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

const stats = [
  { title: 'Coaches', value: '12', color: 'primary', icon: 'fas fa-user-tie', link: '/admin/coaches' },
  { title: 'Clients', value: '120', color: 'info', icon: 'fas fa-user', link: '/admin/clients' },
  { title: 'Available Products', value: '8', color: 'success', icon: 'fas fa-dumbbell', link: '/admin/products' },
  { title: 'Active Subscriptions', value: '34', color: 'warning', icon: 'fas fa-id-card', link: '/admin/subscriptions' },
];

function Admin() {
  const navigate = useNavigate();
  // Dummy notifications
  const notifications = [
    { id: 1, text: '4 coaches pending approval', type: 'warning', link: '/admin/pending-coaches' },
    { id: 2, text: '5 subscriptions need review', type: 'info', link: '/admin/pending-subscriptions' },
  ];
  // Quick actions
  const quickActions = [
    { label: 'Add Coach', icon: 'fas fa-user-plus', link: '/admin/coaches' },
    { label: 'Add Client', icon: 'fas fa-user-friends', link: '/admin/clients' },
    { label: 'Add Product', icon: 'fas fa-box', link: '/admin/products' },
  ];
  // Recent activities (dummy)
  const recentActivities = [
    { id: 1, desc: 'New subscription added', date: '2024-06-01' },
    { id: 2, desc: 'New coach reviewed', date: '2024-05-30' },
    { id: 3, desc: 'Product added', date: '2024-05-29' },
    { id: 4, desc: 'Client added', date: '2024-05-28' },
    { id: 5, desc: 'Coach data updated', date: '2024-05-27' },
  ];
  return (
    
    <div style={{ background: '#f6f8fa', minHeight: '100vh'  }}>
      <ExerciseCategories />
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
          {stats.map((stat, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <div
                className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10 h-100 hover-bg-light`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(stat.link)}
              >
                <div className="card-body d-flex align-items-center gap-3">
                  <div className={`bg-${stat.color} text-white rounded-circle d-flex align-items-center justify-content-center`} style={{ width: 48, height: 48 }}>
                    <i className={`${stat.icon}`}></i>
                  </div>
                  <div>
                    <div className="fw-bold fs-5">{stat.value}</div>
                    <div className="text-muted small">{stat.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Quick actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-3 flex-wrap">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                  onClick={() => navigate(action.link)}
                >
                  <i className={action.icon}></i>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Activities and chart row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Recent Activities</h5>
                <ul className="list-group list-group-flush">
                  {recentActivities.map((act) => (
                    <li key={act.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{act.desc}</span>
                      <span className="badge bg-light text-dark">{act.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">User Statistics (Chart Example)</h5>
                <div className="bg-light rounded" style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                  <span>Chart will be displayed here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Simple CSS */}
      <style>{`
        .hover-bg-light:hover { background: #f1f3f6; }
      `}</style>
      {/* FontAwesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  )
}

export default Admin
