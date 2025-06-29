import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ExpiredSubscribers = () => {
  const navigate = useNavigate();
  const coachId = localStorage.getItem('id');

  const [expiredSubs, setExpiredSubs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (!coachId) return;

    const fetchExpiredSubs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Subscribes/coach/${coachId}`);
        if (!res.ok) throw new Error('Failed to fetch coach subscriptions');
        const data = await res.json();

        const expired = data.filter(sub => sub.status?.toLowerCase() === 'expired');
        setExpiredSubs(expired);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpiredSubs();
  }, [coachId]);

  const generatePDF = (sub) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Coach Report: ${sub.name || sub.userName || 'Subscriber'}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Plan: ${sub.plan || 'N/A'}`, 20, 35);
    doc.text(`Start Date: ${sub.startDate}`, 20, 45);
    doc.text(`End Date: ${sub.endDate}`, 20, 55);
    doc.text(`Progress: ${sub.progress || 'Not specified'}`, 20, 65);
    doc.text(`Coach Rating: ${sub.coachRating || 'N/A'}`, 20, 75);
    doc.text(`User Rating: ${sub.userRating || 'N/A'}`, 20, 85);
    doc.text("Summary:", 20, 95);
    doc.setFont("times", "italic");
    doc.text(sub.reportSummary || "No summary provided yet.", 20, 105, { maxWidth: 170 });
    doc.save(`${sub.name || sub.userName}_report.pdf`);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-orange fw-bold">📁 Expired Subscribers</h3>
    
      {expiredSubs.length === 0 && (
        <div className="text-muted">No expired subscriptions found.</div>
      )}

    {expiredSubs.map((sub) => {
  const name = sub.userName || 'Unnamed User';
  const type = sub.subscriptionType || 'Unknown Type';
  const startDate = sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A';
  const endDate = sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A';
  const email = sub.userEmail;
  const fitnessGoal = sub.fitness_Goal || 'Not specified';

  return (
    <div key={sub.subscribe_ID} className="bg-white rounded shadow-sm p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold">{name}</h5>
          <p className="mb-1 text-muted">{type} • {startDate} → {endDate}</p>
          <p className="mb-1">🎯 Goal: <strong>{fitnessGoal}</strong></p>
          <p className="mb-1">📧 Email: {email}</p>
        </div>

        <div className="d-flex flex-column gap-2">
          <button onClick={() => generatePDF(sub)} className="btn btn-outline-success btn-sm">
            📥 Download Report
          </button>
          {/* <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/coach/expired/${sub.subscribe_ID}`)}
          >
            👁️ View Details
          </button> */}
          {/* <button onClick={() => setShowContactModal(true)} className="btn btn-outline-warning btn-sm">
            📨 Contact Admin
          </button> */}
        </div>
      </div>
    </div>
  );
})}


      {/* Contact Admin Modal */}
      {showContactModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 rounded shadow" style={{ width: '400px' }}>
            <h5 className="mb-3">Contact Admin</h5>
            <textarea rows="4" className="form-control mb-3" placeholder="Write your message..." />
            <div className="d-flex justify-content-end gap-2">
              <button onClick={() => setShowContactModal(false)} className="btn btn-secondary">Close</button>
              <button className="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Selected Subscriber Details */}
      {selected && (
        <div className="bg-light p-3 rounded">
          <h6>📋 Extra Info for {selected.name}</h6>
          <p>{selected.reportSummary || 'No detailed summary available.'}</p>
        </div>
      )}
    </div>
  );
};

export default ExpiredSubscribers;
