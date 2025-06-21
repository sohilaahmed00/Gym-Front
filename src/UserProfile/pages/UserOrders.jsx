import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import styles from './UserOrders.module.css';
import { Link } from 'react-router-dom';
import { API_BASE_IMAGE_URL, API_BASE_URL } from '../../config';


const getStatusClass = (status) => {
  switch (status) {
    case 'Accepted': return styles.accepted;
    case 'Rejected': return styles.rejected;
    case 'Pending': return styles.pending;
    default: return styles.unknown;
  }
};

const UserOrders = () => {
  const userId = localStorage.getItem('id');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_BASE_URL}/Orders/GetOrdersByUserId/${userId}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <div>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.pageTitle}>🧾 My Orders</h3>

      {orders.length === 0 ? (
        <div className={styles.emptyBox}>
          <p>You haven’t placed any orders yet.</p>
          <div className={styles.actions}>
            <Link to="/products" className={styles.primaryBtn}>Browse Products</Link>
            <Link to="/cart" className={styles.outlineBtn}>Go to Cart</Link>
          </div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Date</th>
                <th>Recipient</th>
                <th>Phone</th>
                <th>City</th>
                <th>Address</th>
                <th>Paid</th>
                <th>Total</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td><span className={`${styles.badge} ${getStatusClass(order.order_Status)}`}>{order.order_Status}</span></td>
                  <td>{moment(order.order_Date).format('MMMM Do YYYY, h:mm A')}</td>
                  <td>{order.recipientName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.city}</td>
                  <td>{order.address}</td>
                  <td>{order.isPaid ? '✅' : '❌'}</td>
                  <td>{order.totalPrice.toFixed(2)} EGP</td>
                  <td>
                    <a
                      href={`${API_BASE_IMAGE_URL}/images/${order.paymentProof}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewProof}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
