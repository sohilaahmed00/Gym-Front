import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Carousel } from 'primereact/carousel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCart } from '../../Components/CartContext/CartContext';

const UserHome = () => {
   const { cart } = useCart(); 
  const cartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const toast = useRef(null);
  const toastShown = useRef(false);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('');
  const [subscription, setSubscription] = useState(undefined); // use undefined to detect loading
  const [nextWorkout, setNextWorkout] = useState({});
  const [showNotif, setShowNotif] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isMissed, setIsMissed] = useState(false);
  const [coachName, setCoachName] = useState('');
  const [loading, setLoading] = useState(true);

  const pendingOrders = 1;
  const notifications = [
    { id: 1, message: 'New challenge available!', target: '/challenges' }
  ];
  const warnings = [
    { id: 1, message: 'You missed your last workout.' }
  ];
  const achievements = ['Completed 10 Sessions', '1 Month Streak'];
  const tips = ['Drink water before workouts.', 'Focus on form, not weight.'];

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

  const getTotalSessions = (type) => {
    switch (type) {
      case '1_Month': return 12;
      case '3_Months': return 24;
      case '6_Months': return 36;
      case '12_Months': return 72;
      default: return 0;
    }
  };

  const remaining = subscription ? getTotalSessions(plan) - completedSessions : 0;

  useEffect(() => {
    const userId = localStorage.getItem('id');

    const fetchData = async () => {
      try {
        const [subRes, userRes, assignmentRes] = await Promise.all([
          axios.get(`http://gymmatehealth.runasp.net/api/Subscribes/GetSubscribeByUserId/${userId}`),
          axios.get(`http://gymmatehealth.runasp.net/api/Users/Getuserbyid/${userId}`),
          axios.get(`http://gymmatehealth.runasp.net/api/Assignments/GetAllUserAssignments/${userId}`)
        ]);

        if (!subRes.data || subRes.data.length === 0) {
          setSubscription(null);
          setName(userRes.data.applicationUser?.fullName || '');
          setLoading(false);
          return;
        }

        const sub = subRes.data[0];
        setName(sub.user.applicationUser.fullName);
        setPlan(sub.subscriptionType);
        setSubscription({
          start: sub.startDate,
          end: sub.endDate,
          withCoach: !!sub.coach_ID
        });

        const total = getTotalSessions(sub.subscriptionType);
const completed = Array.isArray(assignmentRes.data)
  ? assignmentRes.data.filter(a => a.isCompleted).length
  : Array.isArray(assignmentRes.data.assignments)
    ? assignmentRes.data.assignments.filter(a => a.isCompleted).length
    : 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        setCompletedSessions(completed);
        setProgress(percentage);

        const upcoming = assignmentRes.data
          .filter(a => !a.isCompleted)
          .sort((a, b) => new Date(a.day) - new Date(b.day));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingWorkout = upcoming[0];
        const workoutDate = upcomingWorkout ? new Date(upcomingWorkout.day) : null;
        const missed = workoutDate && workoutDate < today;

        setNextWorkout(upcomingWorkout || {});
        setIsMissed(missed);

        if (sub.coach_ID) {
          const coachRes = await axios.get(`http://gymmatehealth.runasp.net/api/Coaches/GetCoachbyId/${sub.coach_ID}`);
          setCoachName(coachRes?.data?.applicationUser?.fullName || '');
        }

        if (!toastShown.current) {
          toast.current.show({
            severity: 'info',
            summary: `Welcome back, ${sub.user.applicationUser.fullName}!`,
            detail: `You're currently on the ${sub.subscriptionType} Plan.`,
            life: 3000,
          });
          toastShown.current = true;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setSubscription(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="position-relative">
      <Toast ref={toast} />

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: '#fd5c28' }}>
              👋 Welcome, {name || 'User'}
            </h2>
            {!subscription && (
              <Button
                label="Subscribe Now"
                className="p-button-warning p-button-sm p-1 rounded-2"
                onClick={() => navigate('/subscribe')}
              />
            )}
            {subscription && subscription.withCoach && (
              <div className="my-3">
                <p className="mb-1"><strong>🧑‍🏫 Coach:</strong> <span style={{ background: '#fd5c28' }} className="badge">{coachName}</span></p>
                <p className="mb-1"><strong>📅 Start Date:</strong> {new Date(subscription.start).toLocaleDateString()}</p>
                <p className="mb-1"><strong>📅 End Date:</strong> {new Date(subscription.end).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {!subscription && (
            <div className="alert alert-info">
              You currently have no active subscription. Subscribe now to start your fitness journey!
            </div>
          )}

          {subscription && (
            <>
              {nextWorkout && (
                <div className={`alert ${isMissed ? 'alert-danger' : 'alert-warning'} d-flex justify-content-between align-items-center mb-4 shadow-sm`}>
                  <div>
                    
                    <div>
                      <strong>Upcoming Workout:</strong>
                      {nextWorkout.exercises?.length > 0
                        ? `🏋️ ${nextWorkout.exercises[0].exercise_Name}`
                        : 'No exercises available'}
                    </div>
                    {nextWorkout.day && (
                      <div><strong>Date:</strong> {new Date(nextWorkout.day).toLocaleDateString()}</div>
                    )}
                  </div>
                  <span style={{ background: isMissed ? '#dc3545' : '#fd5c28' }} className="badge text-white">
                    {isMissed ? 'You missed this workout!' : 'Don’t miss it!'}
                  </span>
                </div>
              )}

              <div className="mb-4 p-4 rounded shadow-sm bg-light d-flex justify-content-between align-items-center" style={{ borderLeft: '5px solid #fd5c28' }}>
                <div>
                  <h5 className="mb-1 text-orange">🏋️ Next Workout</h5>
                  <p className="mb-0"><strong>Exercises:</strong>{' '}
                    {nextWorkout.exercises?.length > 0
                      ? nextWorkout.exercises.map((ex, idx) => (
                          <span key={idx} className="d-block">🏋️ {ex.exercise_Name}</span>
                        ))
                      : 'No exercises available'}
                  </p>
                  <p className="mb-0"><strong>Date:</strong> {nextWorkout.day ? new Date(nextWorkout.day).toLocaleDateString() : ''}</p>
                </div>
                <div className="text-end">
                  <span style={{ background: '#fd5c28' }} className="badge text-white px-3 py-2 fs-6">
                    Be Ready!
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded shadow-sm h-100 bg-white card-hover text-center d-flex flex-column justify-content-center align-items-center">
                {subscription ? (
                  <>
                    <h6 className="text-muted mb-2">📈 Training Progress</h6>
                    <Chart type="doughnut" data={chartData} options={chartOptions} />
                    <div className="mt-2 text-orange fw-bold">{progress}% Completed</div>
                    <small className="text-muted">{remaining} sessions remaining</small>
                  </>
                ) : (
                  <>
                    <h6 className="text-muted mb-4">📈 Training Progress</h6>
                    <Button label="Show our coaches!" className="p-button-warning p-button-sm p-1 rounded-2" onClick={() => navigate('/coaches')} />
                    <small className="mt-3 text-muted">Meet our coaches & start today</small>
                  </>
                )}
              </div>
            </div>

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

            {subscription && (
              <div className="col-md-4 d-flex flex-column gap-4">
                <div className="p-3 rounded shadow-sm bg-white card-hover flex-fill">
                  <h6 className="text-muted mb-2">🏆 Achievements</h6>
                  <Carousel
                    value={achievements}
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
                <div className="p-3 rounded shadow-sm bg-white card-hover flex-fill">
                  <h6 className="text-muted mb-2">💡 Daily Tips</h6>
                  <Carousel
                    value={tips}
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
            )}
          </div>

          <Dialog
            header="Subscription Details"
            visible={showSubscriptionModal}
            style={{ width: '400px' }}
            onHide={() => setShowSubscriptionModal(false)}
          >
            <p><strong>Plan:</strong> {plan}</p>
            <p><strong>Start:</strong> {subscription?.start}</p>
            <p><strong>End:</strong> {subscription?.end}</p>
            <p><strong>Type:</strong> {subscription?.withCoach ? 'With Personal Coach' : 'System-Guided Plan'}</p>
            <p><strong>Remaining Sessions:</strong> {remaining}</p>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default UserHome;
