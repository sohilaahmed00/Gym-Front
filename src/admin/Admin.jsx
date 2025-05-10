import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SideList from './SideList'
import ManageCoaches from './ManageCoaches'
import ManageUsers from './ManageUsers'
import ManageProducts from './ManageProducts'

const stats = [
  { title: 'Coaches', value: '12', color: 'primary', icon: 'fas fa-user-tie' },
  { title: 'Clients', value: '120', color: 'info', icon: 'fas fa-user' },
  { title: 'Available Products', value: '8', color: 'success', icon: 'fas fa-dumbbell' },
  { title: 'Active Subscriptions', value: '34', color: 'warning', icon: 'fas fa-id-card' },
];

function Admin() {
  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh'  }}>
      
        
          <div >
            <h2 className="fw-bold mb-1">Welcome to the Admin Panel</h2>
            <p className="text-muted mb-4">Manage your website efficiently!</p>
            {/* Stats */}
            <div className="row g-3 mb-4">
              {stats.map((stat, idx) => (
                <div className="col-12 col-md-6 col-lg-3" key={idx}>
                  <div className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10 h-100`}>
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

            {/* استدعاء كومبوننت إدارة الكوتشز */}
            <ManageCoaches />
            <ManageUsers/>
            <ManageProducts/>

            {/* Chart and Side Box */}
            <div className="row g-3 mb-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">User Statistics (Chart Example)</h5>
                    <div className="bg-light rounded" style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                      <span>Chart will be displayed here</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Traffic Sources</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">Google <span className="badge bg-primary">75%</span></li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Youtube <span className="badge bg-info">60%</span></li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Instagram <span className="badge bg-danger">50%</span></li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">Facebook <span className="badge bg-success">30%</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Management Sections */}
            <div className="row g-3">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Coaches Management</h5>
                    <p className="text-muted small">List, add, edit, delete, filter, and view coach details...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Products Management</h5>
                    <p className="text-muted small">List, add new product, edit or delete products...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Clients Management</h5>
                    <p className="text-muted small">List, view client details, reviews, nutrition/training plans...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Subscriptions Management</h5>
                    <p className="text-muted small">View active and new subscriptions, approve or reject...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Orders Management</h5>
                    <p className="text-muted small">List orders, view order details, order status...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Reports</h5>
                    <p className="text-muted small">Revenue reports, coaches reports, clients reports...</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Site Settings</h5>
                    <p className="text-muted small">Edit general settings, payment settings, email settings...</p>
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
