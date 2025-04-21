import React, { useState } from 'react';
import subscribers from '../data/subscribers.json';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const ExpiredSubscribers = () => {
  const expired = subscribers.filter((s) => s.status === 'expired');
  const [selected, setSelected] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();

  const generatePDF = (sub) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Coach Report: ${sub.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Plan: ${sub.plan}`, 20, 35);
    doc.text(`Start Date: ${sub.startDate}`, 20, 45);
    doc.text(`End Date: ${sub.endDate}`, 20, 55);
    doc.text(`Progress: ${sub.progress || 'Not specified'}`, 20, 65);
    doc.text(`Coach Rating: ${sub.coachRating || 'N/A'}`, 20, 75);
    doc.text(`User Rating: ${sub.userRating || 'N/A'}`, 20, 85);
    doc.text("Summary:", 20, 95);
    doc.setFont("times", "italic");
    doc.text(sub.reportSummary || "No summary provided yet.", 20, 105, { maxWidth: 170 });
    doc.save(`${sub.name}_report.pdf`);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-orange fw-bold">📁 Expired Subscribers</h3>

      {expired.map((sub) => (
        <div key={sub.id} className="bg-white rounded shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold">{sub.name}</h5>
              <p className="mb-1 text-muted">{sub.plan} • {sub.startDate} → {sub.endDate}</p>
              <p className="mb-1">📊 Progress: <strong>{sub.progress}%</strong></p>
              <p className="mb-1">⭐ User Rating: {sub.userRating || 'Not rated'} | 🏅 Coach Rating: {sub.coachRating || 'Not rated'}</p>
            </div>

            <div className="d-flex flex-column gap-2">
              <button onClick={() => generatePDF(sub)} className="btn btn-outline-success btn-sm">
                📥 Download Report
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate(`/coach/expired/${sub.id}`)}
                >
                👁️ View Details
                </button>
              <button onClick={() => setShowContactModal(true)} className="btn btn-outline-warning btn-sm">
                📨 Contact Admin
              </button>
            </div>
          </div>
        </div>
      ))}

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
