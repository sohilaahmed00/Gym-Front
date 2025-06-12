import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    RecipientName: '',
    Address: '',
    City: '',
    PhoneNumber: ''
  });
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await axios.get(`http://gymmatehealth.runasp.net/api/Orders/GetOrderById/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setEditData({
        RecipientName: order.recipientName || '',
        Address: order.address || '',
        City: order.city || '',
        PhoneNumber: order.phoneNumber || ''
      });
    }
  }, [order]);

  if (loading) return <div className="container py-5 text-center">Loading order details...</div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;
  if (!order) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4">
            <h2 className="mb-4" style={{ color: '#FF5722' }}>Order Placed Successfully!</h2>
            <h5 className="mb-3">Order Summary</h5>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>Recipient Name:</span>
                <span>{order.recipientName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Address:</span>
                <span>{order.address}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>City:</span>
                <span>{order.city}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Phone Number:</span>
                <span>{order.phoneNumber}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Status:</span>

                <span>{(order.orderStatus === 'Accepted' || order.orderStatus === 'Approved' || order.order_Status === 'Accepted' || order.order_Status === 'Approved') ? 'Approved' : (order.orderStatus || order.order_Status)}</span>

                <span>{order.orderStatus || order.order_Status}</span>

              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total Price:</span>
                <span>EGP {order.totalPrice}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Order Date:</span>
                <span>{order.orderDate ? new Date(order.orderDate).toLocaleString() : (order.order_Date ? new Date(order.order_Date).toLocaleString() : '')}</span>
              </li>
              {order.paymentProof && (
                <>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Payment Proof:</span>
                    <img

                      src={`http://gymmatehealth.runasp.net/images/PaymentProofs/${order.paymentProof}`}

                      alt="Payment Proof"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px #eee', cursor: 'pointer', border: '2px solid #FF5722', marginLeft: '10px' }}
                      onClick={() => setShowImageModal(true)}
                    />
                  </li>
                  {showImageModal && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                      }}
                      onClick={() => setShowImageModal(false)}
                    >
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: '12px',
                          maxWidth: '90vw',
                          maxHeight: '90vh',
                          boxShadow: '0 4px 24px #0008',
                          position: 'relative',
                          padding: '24px 24px 16px 24px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 18,
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: '#333',
                            cursor: 'pointer'
                          }}
                          onClick={() => setShowImageModal(false)}
                          title="Close"
                        >×</span>
                        <h3 style={{margin: 0, marginBottom: 16}}>Payment Proof</h3>
                        <img

                         src={`http://gymmatehealth.runasp.net/images/PaymentProofs/${order.paymentProof}`}

                         

                          alt="Payment Proof Large"
                          style={{ maxWidth: '70vw', maxHeight: '65vh', borderRadius: '10px', boxShadow: '0 2px 8px #eee' }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </ul>
            {updateMsg && <div className="alert alert-success text-center">{updateMsg}</div>}
            {!editMode && (
              <div className="d-flex gap-2 justify-content-center mt-2 mb-2">
                <button 
                  className="btn btn-warning d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: '25px',
                    padding: '7px 22px',
                    fontSize: '1rem',
                    minWidth: '120px',
                    boxShadow: '0 1px 4px #0001',
                    fontWeight: 500
                  }}
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa fa-edit me-2" style={{fontSize: '1.1em'}}></i>
                  Edit Order
                </button>
                <Link 
                  to="/" 
                  className="btn btn-success d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: '#FF5722',
                    borderColor: '#FF5722',
                    color: '#fff',
                    fontSize: '1rem',
                    borderRadius: '25px',
                    padding: '7px 22px',
                    minWidth: '120px',
                    fontWeight: 500,
                    boxShadow: '0 1px 4px #0001',
                    transition: 'background 0.2s, border 0.2s'
                  }}
                  onMouseOver={e => { e.target.style.backgroundColor = '#e64a19'; e.target.style.borderColor = '#e64a19'; }}
                  onMouseOut={e => { e.target.style.backgroundColor = '#FF5722'; e.target.style.borderColor = '#FF5722'; }}
                >
                  <i className="fa fa-home me-2" style={{fontSize: '1.1em'}}></i>
                  Back to Home
                </Link>
              </div>
            )}
            {editMode && (
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setUpdateMsg('');
                  try {
                    await axios.put(`http://gymmatehealth.runasp.net/api/Orders/UpdateOrder/${orderId}`, editData);
                    setOrder({ ...order, 
                      recipientName: editData.RecipientName,
                      address: editData.Address,
                      city: editData.City,
                      phoneNumber: editData.PhoneNumber
                    });
                    setUpdateMsg('Order updated successfully!');
                    setEditMode(false);
                  } catch (err) {
                    setUpdateMsg('Error updating order!');
                  }
                }}
                className="mb-3"
              >
                <div className="mb-2">
                  <label className="form-label">Recipient Name</label>
                  <input type="text" className="form-control" value={editData.RecipientName} onChange={e => setEditData({ ...editData, RecipientName: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={editData.Address} onChange={e => setEditData({ ...editData, Address: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" value={editData.City} onChange={e => setEditData({ ...editData, City: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={editData.PhoneNumber} onChange={e => setEditData({ ...editData, PhoneNumber: e.target.value })} required />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success flex-fill">Save Changes</button>
                  <button type="button" className="btn btn-secondary flex-fill" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 