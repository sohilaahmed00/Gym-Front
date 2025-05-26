import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../data/userData.json';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Carousel } from 'primereact/carousel';

const UserHome = () => {
  const toast = useRef(null);
  const toastShown = useRef(false);
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const {
    name,
    plan,
    subscription,
    progress,
    completedSessions,
    nextWorkout,
    cartItems,
    pendingOrders,
    notifications,
    warnings,
    notes
  } = userData;

  const remaining = 36 - completedSessions;

  const chartData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ['#fd5c28', '#eee'],
        hoverBackgroundColor: ['#fd5c28', '#ccc']
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
    },
  };

  useEffect(() => {
    if (!toastShown.current) {
      toast.current.show({
        severity: 'info',
        summary: `Welcome back, ${name}!`,
        detail: `You're currently on the ${plan}.`,
        life: 3000,
      });
      toastShown.current = true;
    }
  }, [name, plan]);

  return (
    <div className="position-relative">
      <Toast ref={toast} />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: '#fd5c28' }}>👋 Welcome, {name}</h2>
        <div className="d-flex gap-4 position-relative">
          {/* Notifications */}
          <div className="position-relative">
            <i
              className="pi pi-bell"
              style={{ fontSize: '1.3rem', cursor: 'pointer' }}
              onClick={() => setShowNotif(!showNotif)}
            ></i>
            {notifications.length > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {notifications.length}
              </span>
            )}

            {showNotif && (
              <div className="position-absolute bg-white shadow rounded p-3" style={{ width: '260px', top: '30px', right: 0, zIndex: 10 }}>
                <h6 className="mb-2">Notifications</h6>
                <ul className="list-unstyled mb-0">
                  {notifications.map((n) => (
                    <li key={n.id} className="mb-2" style={{ cursor: 'pointer' }} onClick={() => navigate(n.target)}>
                      🔔 {n.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Warnings */}
          <div className="position-relative">
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: '1.3rem', cursor: 'pointer' }}
              onClick={() => setShowWarnings(!showWarnings)}
            ></i>
            {warnings.length > 0 && (
              <span className="badge bg-warning position-absolute top-0 start-100 translate-middle">
                {warnings.length}
              </span>
            )}

            {showWarnings && (
              <div className="position-absolute bg-white shadow rounded p-3" style={{ width: '260px', top: '30px', right: 0, zIndex: 10 }}>
                <h6 className="mb-2">Warnings</h6>
                <ul className="list-unstyled mb-0">
                  {warnings.map((w) => (
                    <li key={w.id} className="mb-2">⚠️ {w.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4 shadow-sm">
        <div>
          <strong>Upcoming Workout:</strong> {nextWorkout.focus} on {nextWorkout.day} ({nextWorkout.date})
        </div>
        <span  style={{ background: '#fd5c28' }} className="badge  text-white">Don’t miss it!</span>
      </div>
{/* Next Workout Section */}
<div className="mb-4 p-4 rounded shadow-sm bg-light d-flex justify-content-between align-items-center" style={{ borderLeft: '5px solid #fd5c28' }}>
  <div>
    <h5 className="mb-1 text-orange">🏋️ Next Workout</h5>
    <p className="mb-0"><strong>Type:</strong> {nextWorkout.focus}</p>
    <p className="mb-0"><strong>Day:</strong> {nextWorkout.day}</p>
    <p className="mb-0"><strong>Date:</strong> {nextWorkout.date}</p>
  </div>
  <div className="text-end">
    <span  style={{ background: '#fd5c28' }} className="badge text-white  px-3 py-2 fs-6">Be Ready!</span>
  </div>
</div>

      {/* Cards */}
      <div className="row g-4">
  {/* Progress Chart */}
  <div className="col-md-4">
    <div className="p-4 rounded shadow-sm h-100 bg-white card-hover text-center">
      <h6 className="text-muted mb-2">📈 Training Progress</h6>
      <Chart type="doughnut" data={chartData} options={chartOptions} />
      <div className="mt-2 text-orange fw-bold">{progress}% Completed</div>
      <small className="text-muted">{remaining} sessions remaining</small>
    </div>
  </div>

  {/* Cart */}
  <div className="col-md-4 d-flex flex-column gap-4">
    <div className="p-4 rounded shadow-sm bg-white card-hover text-center flex-fill">
      <h6 className="text-muted mb-2">🛒 Cart Items</h6>
      <h2 className="text-primary">{cartItems}</h2>
      <p className="text-muted">Waiting for checkout</p>
    </div>

    <div className="p-4 rounded shadow-sm bg-white card-hover text-center flex-fill">
      <h6 className="text-muted mb-2">📦 Pending Orders</h6>
      <h2 className="text-success">{pendingOrders}</h2>
      <p className="text-muted">Preparing or shipping</p>
    </div>
  </div>

  {/* New: Achievements + Tips */}
<div className="col-md-4 d-flex flex-column gap-4">
  {/* Achievement Carousel */}
  <div className="p-3 rounded shadow-sm bg-white card-hover flex-fill">
    <h6 className="text-muted mb-2">🏆 Achievements</h6>
    <Carousel
      value={userData.achievements}
      itemTemplate={(item) => (
        <div className="text-center px-3">
          <p className="fw-bold text-success mb-1">{item}</p>
        </div>
      )}
      numVisible={1}
      numScroll={1}
      circular
      autoplayInterval={3500}
    />
  </div>

  {/* Tip Carousel */}
  <div className="p-3 rounded shadow-sm bg-white card-hover flex-fill">
    <h6 className="text-muted mb-2">💡 Daily Tips</h6>
    <Carousel
      value={userData.tips}
      itemTemplate={(tip) => (
        <div className="text-center px-3">
          <p className="mb-1">{tip}</p>
        </div>
      )}
      numVisible={1}
      numScroll={1}
      circular
      autoplayInterval={4000}
    />
  </div>
</div>

</div>


      {/* Subscription Modal */}
      <Dialog header="Subscription Details" visible={showSubscriptionModal} style={{ width: '400px' }} onHide={() => setShowSubscriptionModal(false)}>
        <p><strong>Plan:</strong> {plan}</p>
        <p><strong>Start:</strong> {subscription.start}</p>
        <p><strong>End:</strong> {subscription.end}</p>
        <p><strong>Type:</strong> {subscription.withCoach ? 'With Personal Coach' : 'System-Guided Plan'}</p>
        <p><strong>Remaining Sessions:</strong> {remaining}</p>
      </Dialog>
    </div>
  );
};

export default UserHome;
