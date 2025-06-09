import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fake data for testing
  const fakeOrders = [
    {
      orderId: 1,
      user: { name: 'John Doe' },
      product: { name: 'Whey Protein', image: '' },
      quantity: 2,
      price: 500,
      status: 'Pending',
      orderDate: '2025-06-10',
      paymentProof: '',
      shippingDetails: {
        fullName: 'John Doe',
        address: '123 Main St, Cairo',
        city: 'Cairo',
        phone: '01234567890',
        notes: 'Please deliver in the evening'
      }
    },
    {
      orderId: 2,
      user: { name: 'Jane Smith' },
      product: { name: 'Creatine', image: '' },
      quantity: 1,
      price: 300,
      status: 'Approved',
      orderDate: '2025-06-11',
      paymentProof: '',
      shippingDetails: {
        fullName: 'Jane Smith',
        address: '456 Park Ave, Alexandria',
        city: 'Alexandria',
        phone: '01123456789',
        notes: 'Leave at the reception'
      }
    },
    // أوردر متعدد المنتجات
    {
      orderId: 3,
      user: { name: 'Ahmed Ali' },
      products: [
        { name: 'Whey Protein', image: '', quantity: 2 },
        { name: 'Creatine', image: '', quantity: 1 },
        { name: 'BCAA', image: '', quantity: 3}
      ],
      status: 'Pending',
      orderDate: '2025-06-15',
      paymentProof: '',
      shippingDetails: {
        fullName: 'Ahmed Ali',
        address: '789 Nile St, Giza',
        city: 'Giza',
        phone: '01098765432',
        notes: 'Call before delivery'
      }
    }
  ];

  useEffect(() => {
    setLoading(true);
    axios.get('http://gymmatehealth.runasp.net/api/Orders/GetAll')
      .then(res => setOrders(res.data.length ? res.data : fakeOrders))
      .catch(() => setOrders(fakeOrders))
      .finally(() => setLoading(false));
  }, []);

  // Approve order
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Orders/approve/${id}`);
      setOrders(prev => prev.map(order => order.orderId === id ? { ...order, status: 'Approved' } : order));
      alert('Order approved successfully!');
    } catch {
      alert('Error approving order!');
    }
  };

  // Reject order
  const handleReject = async (id) => {
    try {
      await axios.put(`http://gymmatehealth.runasp.net/api/Orders/reject/${id}`);
      setOrders(prev => prev.map(order => order.orderId === id ? { ...order, status: 'Rejected' } : order));
      alert('Order rejected!');
    } catch {
      alert('Error rejecting order!');
    }
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0" style={{fontSize: '2rem'}}>Manage Product Orders</h4>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="bg-light">
                <tr>
                  <th>User Name</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Order Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center">Loading...</td></tr>
                ) : orders.map(order => (
                  <tr key={order.orderId}>
                    <td>{order.user?.name || "N/A"}</td>
                    <td>
                      {Array.isArray(order.products) ? (
                        <div>
                          {order.products.map((prod, idx) => (
                            <span key={idx} style={{ display: 'block', fontWeight: 500 }}>
                              {prod.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <>
                          {order.product?.image && (
                            <img src={order.product.image} alt={order.product.name} width="40" style={{ marginRight: 8, borderRadius: 6 }} />
                          )}
                          {order.product?.name}
                        </>
                      )}
                    </td>
                    <td>
                      {Array.isArray(order.products)
                        ? order.products.reduce((acc, prod) => acc + (prod.quantity || 0), 0)
                        : order.quantity}
                    </td>
                    <td>
                      {Array.isArray(order.products)
                        ? order.products.reduce((acc, prod) => acc + ((prod.price || 0) * (prod.quantity || 1)), 0) + ' EGP'
                        : order.price + ' EGP'}
                    </td>
                    <td>{order.orderDate}</td>
                    <td>
                      <span className={`badge bg-${order.status === 'Approved' ? 'success' : order.status === 'Rejected' ? 'danger' : 'warning text-dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'Pending' && (
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleApprove(order.orderId)}>
                            <i className="fas fa-check me-1"></i> Approve
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleReject(order.orderId)}>
                            <i className="fas fa-times me-1"></i> Reject
                          </button>
                        </div>
                      )}
                      {order.status !== 'Pending' && <span className="text-muted">{order.status}</span>}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info" onClick={() => handleShowDetails(order)}>
                        <i className="fas fa-info-circle me-1"></i> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Order Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedOrder && (
            <div>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-bold">Order Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <label className="text-muted small mb-1 d-block">User Name</label>
                          <div className="fw-medium">{selectedOrder.user?.name}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">Order Date</label>
                          <div className="fw-medium">{selectedOrder.orderDate}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">Status</label>
                          <div>
                            <span className={`badge bg-${selectedOrder.status === 'Approved' ? 'success' : selectedOrder.status === 'Rejected' ? 'danger' : 'warning text-dark'} px-3 py-2`}>
                              {selectedOrder.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom">
                      <h6 className="mb-0 fw-bold">Shipping Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <label className="text-muted small mb-1 d-block">Full Name</label>
                          <div className="fw-medium">{selectedOrder.shippingDetails?.fullName}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">Address</label>
                          <div className="fw-medium">{selectedOrder.shippingDetails?.address}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">City</label>
                          <div className="fw-medium">{selectedOrder.shippingDetails?.city}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">Phone</label>
                          <div className="fw-medium">{selectedOrder.shippingDetails?.phone}</div>
                        </div>
                        <div>
                          <label className="text-muted small mb-1 d-block">Notes</label>
                          <div className="fw-medium">{selectedOrder.shippingDetails?.notes || 'No notes'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white border-bottom">
                  <h6 className="mb-0 fw-bold">Products</h6>
                </div>
                <div className="card-body p-0">
                  {Array.isArray(selectedOrder.products) ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0">Product</th>
                            <th className="border-0">Quantity</th>
                            <th className="border-0">Price</th>
                            <th className="border-0">Image</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.products.map((prod, idx) => (
                            <tr key={idx}>
                              <td className="fw-medium">{prod.name}</td>
                              <td>{prod.quantity}</td>
                              <td>{prod.price} EGP</td>
                              <td>
                                {prod.image ? (
                                  <img src={prod.image} alt={prod.name} width="40" height="40" className="rounded" style={{objectFit: 'cover'}} />
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="d-flex align-items-center gap-3">
                        {selectedOrder.product?.image && (
                          <img src={selectedOrder.product.image} alt={selectedOrder.product.name} width="50" height="50" className="rounded" style={{objectFit: 'cover'}} />
                        )}
                        <div>
                          <div className="fw-medium">{selectedOrder.product?.name}</div>
                          <div className="text-muted small">Quantity: {selectedOrder.quantity} | Price: {selectedOrder.price} EGP</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white border-bottom">
                  <h6 className="mb-0 fw-bold">Payment Proof</h6>
                </div>
                <div className="card-body">
                  {selectedOrder.paymentProof ? (
                    <div className="text-center">
                      <img 
                        src={selectedOrder.paymentProof} 
                        alt="Payment Proof" 
                        className="img-fluid rounded" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          objectFit: 'contain',
                          border: '1px solid #eee'
                        }} 
                      />
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="fas fa-receipt fa-2x mb-2"></i>
                      <div>No payment proof</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <style>{`
        .table th, .table td {
          font-size: 15px;
          padding: 12px 16px;
        }
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-group .btn {
          padding: 0.2rem 0.7rem;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
} 