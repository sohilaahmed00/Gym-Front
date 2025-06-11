import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    axios.get('http://gymmatehealth.runasp.net/api/Orders/GetAllOrders')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  // موافقة الطلب
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Orders/ApproveOrder/${id}`);
      setOrders(prev => prev.map(order => order.order_id === id ? { ...order, order_Status: 'Approved' } : order));
      alert('Order approved successfully!');
    } catch {
      alert('Error approving order!');
    }
  };

  // رفض الطلب
  const handleReject = async (id) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Orders/RejectOrder/${id}`);
      setOrders(prev => prev.map(order => order.order_id === id ? { ...order, order_Status: 'Rejected' } : order));
      alert('Order rejected!');
    } catch {
      alert('Error rejecting order!');
    }
  };

  // Fetch order details by id
  const fetchOrderDetails = useCallback(async (id) => {
    setDetailsLoading(true);
    try {
      const res = await axios.get(`http://gymmatehealth.runasp.net/api/Orders/GetOrderById/${id}`);
      setOrderDetails(res.data);
    } catch {
      setOrderDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const handleShowDetails = (order) => {
    setShowModal(true);
    fetchOrderDetails(order.order_id);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setOrderDetails(null);
  };

  return (
    <div className="container-fluid py-4 manage-orders-page">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0 page-title">Manage Orders</h4>
          </div>
          <div className="d-flex gap-2 mb-4 filter-buttons">
            <button
              className={`btn btn-sm filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >All</button>
            <button
              className={`btn btn-sm filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >Pending</button>
            <button
              className={`btn btn-sm filter-btn ${statusFilter === 'Approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Approved')}
            >Approved</button>
            <button
              className={`btn btn-sm filter-btn ${statusFilter === 'Rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Rejected')}
            >Rejected</button>
          </div>
          <div className="table-responsive">
            <table className="table align-middle orders-table">
              <thead>
                <tr>
                  <th>Recipient Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center loading-cell">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={4} className="text-center no-orders">No orders found</td></tr>
                ) : orders
                    .filter(order => statusFilter === 'All' || (statusFilter === 'Approved' ? (order.order_Status === 'Approved' || order.order_Status === 'Accepted') : order.order_Status === statusFilter))
                    .map(order => (
                      <tr key={order.order_id} className="order-row">
                        <td>{order.recipientName}</td>
                        <td className="text-center">
                          <span className={`status-badge ${order.order_Status.toLowerCase()}`}>
                            {order.order_Status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm details-btn"
                            onClick={() => handleShowDetails(order)}
                          >
                            <i className="fas fa-info-circle"></i> Details
                          </button>
                        </td>
                        <td>
                          {order.order_Status === 'Pending' && (
                            <div className="btn-group action-buttons">
                              <button className="btn btn-sm approve-btn small-action-btn" onClick={() => handleApprove(order.order_id)}>
                                <i className="fas fa-check icon-space"></i> Approve
                              </button>
                              <button className="btn btn-sm reject-btn small-action-btn" onClick={() => handleReject(order.order_id)}>
                                <i className="fas fa-times icon-space"></i> Reject
                              </button>
                            </div>
                          )}
                          {(order.order_Status === 'Approved' || order.order_Status === 'Accepted') && (
                            <span className="status-text approved">Approved</span>
                          )}
                          {order.order_Status === 'Rejected' && (
                            <span className="status-text rejected">Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="order-details-modal">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : orderDetails ? (
            <div className="order-details-content">
              <div className="row g-4">
                <div className="col-12 mb-3">
                  <div className="card info-card">
                    <div className="card-header">
                      <h6>Order Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="info-item">
                            <label>Recipient Name</label>
                            <div>{orderDetails.recipientName}</div>
                          </div>
                          <div className="info-item">
                            <label>Address</label>
                            <div>{orderDetails.address}</div>
                          </div>
                          <div className="info-item">
                            <label>City</label>
                            <div>{orderDetails.city}</div>
                          </div>
                          <div className="info-item">
                            <label>Phone Number</label>
                            <div>{orderDetails.phoneNumber}</div>
                          </div>
                          <div className="info-item">
                            <label>Total Price</label>
                            <div>{orderDetails.totalPrice} EGP</div>
                          </div>
                          <div className="info-item">
                            <label>Order Date</label>
                            <div>{orderDetails.orderDate?.split('T')[0]}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="payment-proof">
                            <label>Payment Proof</label>
                            {orderDetails.paymentProof ? (
                              <img 
                                src={`https://gymmatehealth.runasp.net/images/PaymentProofs/${orderDetails.paymentProof}`}
                                alt="Payment Proof"
                                className="proof-image"
                                onError={e => {
                                  if (!e.target.src.includes('/Images/PaymentProofs/')) {
                                    e.target.onerror = null;
                                    e.target.src = `https://gymmatehealth.runasp.net/Images/PaymentProofs/${orderDetails.paymentProof}`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="no-proof">
                                <i className="fas fa-receipt"></i>
                                <span>No payment proof</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card items-card">
                    <div className="card-header">
                      <h6>Order Items</h6>
                    </div>
                    <div className="card-body">
                      {orderDetails.items && orderDetails.items.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table items-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Image</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.items.map((item, idx) => (
                                <tr key={item.orderItemId || idx}>
                                  <td>{item.productName}</td>
                                  <td>{item.description}</td>
                                  <td>{item.price} EGP</td>
                                  <td>{item.discount * 100}%</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.itemTotalPrice} EGP</td>
                                  <td>
                                    {item.imageUrl ? (
                                      <img 
                                        src={`http://gymmatehealth.runasp.net/Images/Products/${item.imageUrl}`} 
                                        alt={item.productName} 
                                        className="product-image"
                                      />
                                    ) : (
                                      <span className="no-image">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="no-items">No items found for this order</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-message">Failed to load order details</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="close-btn"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .manage-orders-page {
          background-color: #f8f9fa;
          min-height: 100vh;
          padding: 20px;
        }

        .page-title {
          color: #2c3e50;
          font-size: 2rem;
          position: relative;
          padding-left: 15px;
          margin-bottom: 30px;
        }

        .page-title::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 70%;
          background-color: #ff7a00;
          border-radius: 2px;
        }

        .filter-buttons {
          background-color: #fff;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }

        .filter-btn {
          padding: 8px 20px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 2px solid #e9ecef;
          background-color: #fff;
          color: #6c757d;
          margin: 0 5px;
        }

        .filter-btn:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }

        .filter-btn.active {
          background-color: #ff7a00;
          border-color: #ff7a00;
          color: #fff;
        }

        .orders-table {
          background-color: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }

        .orders-table thead {
          background-color: #f8f9fa;
        }

        .orders-table th {
          font-weight: 600;
          color: #495057;
          padding: 15px;
          border-bottom: 2px solid #e9ecef;
        }

        .orders-table td {
          padding: 15px;
          vertical-align: middle;
        }

        .order-row {
          transition: all 0.3s ease;
        }

        .order-row:hover {
          background-color: #f8f9fa;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-badge.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-badge.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .details-btn {
          background-color: #fff;
          border: 2px solid #6c757d;
          color: #6c757d;
          padding: 6px 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .details-btn:hover {
          background-color: #6c757d;
          color: #fff;
        }

        .action-buttons {
          gap: 8px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
        }

        .approve-btn, .reject-btn {
          padding: 2px 10px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.92rem;
          min-width: 70px;
          height: 32px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .approve-btn {
          background-color: #28a745;
          border-color: #28a745;
          color: #fff;
        }

        .reject-btn {
          background-color: #dc3545;
          border-color: #dc3545;
          color: #fff;
        }

        .approve-btn:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }

        .reject-btn:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }

        .status-text {
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .status-text.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-text.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .order-details-modal .modal-content {
          border-radius: 15px;
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .order-details-modal .modal-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          padding: 20px;
          border-radius: 15px 15px 0 0;
        }

        .order-details-modal .modal-title {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .order-details-modal .modal-body {
          padding: 25px;
        }

        .info-card, .items-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          margin-bottom: 20px;
        }

        .info-card .card-header, .items-card .card-header {
          background-color: #fff;
          border-bottom: 1px solid #e9ecef;
          padding: 15px 20px;
          border-radius: 12px 12px 0 0;
        }

        .info-card .card-header h6, .items-card .card-header h6 {
          margin: 0;
          font-weight: 600;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .info-item {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .info-item label {
          display: block;
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .info-item div {
          color: #2c3e50;
          font-weight: 500;
        }

        .payment-proof {
          text-align: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 12px;
        }

        .payment-proof label {
          display: block;
          color: #6c757d;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .proof-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          border: 2px solid #e9ecef;
          padding: 5px;
          background-color: #fff;
        }

        .no-proof {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          color: #6c757d;
          border: 2px dashed #e9ecef;
        }

        .no-proof i {
          font-size: 2rem;
          margin-bottom: 10px;
          display: block;
          color: #dee2e6;
        }

        .items-table {
          margin: 0;
        }

        .items-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
          padding: 12px;
        }

        .items-table td {
          padding: 12px;
          vertical-align: middle;
        }

        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
          border: 2px solid #e9ecef;
        }

        .no-image {
          color: #6c757d;
          font-style: italic;
        }

        .close-btn {
          background-color: #ff7a00;
          border-color: #ff7a00;
          color: #fff;
          padding: 8px 25px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background-color: #ff8800;
          border-color: #ff8800;
        }

        .loading-cell, .no-orders, .error-message {
          padding: 30px;
          text-align: center;
          color: #6c757d;
          font-size: 1.1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .small-action-btn {
          padding: 1px 2px !important;
          font-size: 0.78rem !important;
          width: fit-content !important;
          max-width: 100px !important;
          min-width: 0 !important;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
        }

        .icon-space {
          margin-right: 5px;
        }

        @media (max-width: 768px) {
          .filter-buttons {
            flex-wrap: wrap;
          }
          
          .filter-btn {
            flex: 1 1 calc(50% - 8px);
            margin-bottom: 8px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .approve-btn, .reject-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 