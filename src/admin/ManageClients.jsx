// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';

// const API_BASE_URL = 'http://gymmatehealth.runasp.net/api';

// export default function ManageClients() {
//   // Clients state
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     membership: '',
//     status: '',
//     joinDate: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });

//   // Show alert function
//   const showAlert = (message, type = 'success') => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
//   };

//   // Handle delete client
//   const handleDeleteClient = async (userId) => {
//     if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

//     try {
//       setDeletingId(userId);
//       const response = await axios.delete(`${API_BASE_URL}/Users/DeleteUser/${userId}`);
      
//       if (response.status === 200) {
//         setClients(clients.filter(client => client.id !== userId));
//         setFilteredClients(filteredClients.filter(client => client.id !== userId));
//         showAlert('تم حذف المستخدم بنجاح', 'success');
//       }
//     } catch (error) {
//       console.error('Error deleting client:', error);
//       showAlert('حدث خطأ أثناء حذف المستخدم', 'danger');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Mock API call function
//   const fetchClients = async (searchQuery = '') => {
//     setLoading(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Mock data
//       const data = [
//         { 
//           id: 1, 
//           name: 'John Smith', 
//           email: 'john.smith@email.com',
//           membership: 'Premium',
//           joinDate: '2024-01-15',
//           status: 'Active',
//           lastVisit: '2024-03-10'
//         },
//         { 
//           id: 2, 
//           name: 'Emma Wilson', 
//           email: 'emma.wilson@email.com',
//           membership: 'Basic',
//           joinDate: '2024-02-01',
//           status: 'Active',
//           lastVisit: '2024-03-12'
//         },
//         { 
//           id: 3, 
//           name: 'Michael Brown', 
//           email: 'michael.brown@email.com',
//           membership: 'Premium',
//           joinDate: '2023-12-10',
//           status: 'Inactive',
//           lastVisit: '2024-02-28'
//         }
//       ];

//       // Filter data based on search query
//       const filteredData = searchQuery
//         ? data.filter(client => 
//             client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             client.membership.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         : data;

//       setClients(filteredData);
//       setFilteredClients(filteredData);
//     } catch (error) {
//       console.error('Error fetching clients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchClients();
//   }, []);

//   // Handle search and filters
//   useEffect(() => {
//     let result = [...clients];

//     // Apply filters
//     if (filters.membership) {
//       result = result.filter(client => client.membership === filters.membership);
//     }
//     if (filters.status) {
//       result = result.filter(client => client.status === filters.status);
//     }
//     if (filters.joinDate) {
//       result = result.filter(client => client.joinDate === filters.joinDate);
//     }

//     setFilteredClients(result);
//   }, [filters, clients]);

//   // Handle search input with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchClients(searchTerm);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: value
//     }));
//   };

//   return (
//     <div className="container-fluid py-4">
//       {/* Alert Component */}
//       {alert.show && (
//         <div className={`alert alert-${alert.type} alert-dismissible fade show mt-2 mb-3`} role="alert">
//           <div className="d-flex align-items-center">
//             {alert.type === 'success' ? (
//               <i className="fas fa-check-circle me-2"></i>
//             ) : (
//               <i className="fas fa-exclamation-circle me-2"></i>
//             )}
//             <strong>{alert.message}</strong>
//           </div>
//           <button 
//             type="button" 
//             className="btn-close" 
//             onClick={() => setAlert({ ...alert, show: false })}
//             aria-label="إغلاق"
//           ></button>
//         </div>
//       )}

//       <div className="card border-0 shadow-sm">
//         <div className="card-body p-4">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h4 className="fw-bold mb-0">Clients Management</h4>
//             <button className="btn btn-primary">
//               <i className="fas fa-plus me-2"></i>
//               Add New Client
//             </button>
//           </div>

//           {/* Filters Section */}
//           <div className="row g-3 mb-4">
//             <div className="col-md-3">
//               <select 
//                 className="form-select"
//                 value={filters.membership}
//                 onChange={(e) => handleFilterChange('membership', e.target.value)}
//               >
//                 <option value="">All Memberships</option>
//                 <option value="Premium">Premium</option>
//                 <option value="Basic">Basic</option>
//               </select>
//             </div>
//             <div className="col-md-3">
//               <select 
//                 className="form-select"
//                 value={filters.status}
//                 onChange={(e) => handleFilterChange('status', e.target.value)}
//               >
//                 <option value="">All Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
//             <div className="col-md-3">
//               <input 
//                 type="date" 
//                 className="form-control" 
//                 placeholder="Join Date"
//                 value={filters.joinDate}
//                 onChange={(e) => handleFilterChange('joinDate', e.target.value)}
//               />
//             </div>
//             <div className="col-md-3">
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <i className="fas fa-search text-muted"></i>
//                 </span>
//                 <input 
//                   type="text" 
//                   className="form-control border-start-0" 
//                   placeholder="Search clients..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Table Section */}
//           <div className="table-responsive">
//             <table className="table align-middle mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th className="border-0 text-start">Client</th>
//                   <th className="border-0">Email</th>
//                   <th className="border-0">Membership</th>
//                   <th className="border-0">Join Date</th>
//                   <th className="border-0">Last Visit</th>
//                   <th className="border-0">Status</th>
//                   <th className="border-0">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div className="d-flex justify-content-center align-items-center">
//                         <div className="spinner-border text-primary me-2" role="status">
//                           <span className="visually-hidden">جاري التحميل...</span>
//                         </div>
//                         جاري تحميل البيانات...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredClients.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       لا يوجد مستخدمين
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredClients.map((client) => (
//                     <tr key={client.id} className="client-row">
//                       <td className="text-start">
//                         <span style={{
//                           display: 'inline-flex',
//                           alignItems: 'center',
//                           gap: 10,
//                         }}>
//                           <span style={{
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             width: 38,
//                             height: 38,
//                             borderRadius: '50%',
//                             background: '#0d6efd22',
//                             color: '#0d6efd',
//                             fontSize: 20,
//                             marginRight: 6,
//                           }}>
//                             <i className="fas fa-user"></i>
//                           </span>
//                           <span style={{ fontWeight: 600, fontSize: 16 }}>{client.name}</span>
//                         </span>
//                       </td>
//                       <td>{client.email}</td>
//                       <td>
//                         <span className="badge bg-primary">
//                           {client.membership}
//                         </span>
//                       </td>
//                       <td>{client.joinDate}</td>
//                       <td>{client.lastVisit}</td>
//                       <td>
//                         <span className={`badge ${client.status === 'Active' ? 'bg-success' : 'bg-danger'} text-white`}>
//                           {client.status}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="btn-group">
//                           <button className="btn btn-sm btn-outline-primary">
//                             <i className="fas fa-edit me-1"></i>
//                             تعديل
//                           </button>
//                           <button 
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDeleteClient(client.id)}
//                             disabled={deletingId === client.id}
//                           >
//                             {deletingId === client.id ? (
//                               <>
//                                 <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                                 جاري الحذف...
//                               </>
//                             ) : (
//                               <>
//                                 <i className="fas fa-trash me-1"></i>
//                                 حذف
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       <style>{`
//         .client-row:hover { 
//           background: #f8f9fa; 
//           transition: all 0.2s ease;
//         }
//         .badge {
//           font-weight: 500;
//           padding: 6px 10px;
//         }
//         .table th {
//           font-size: 13px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }
//         .btn-group .btn {
//           padding: 0.4rem 0.8rem;
//         }
//         .form-select, .form-control {
//           border-radius: 8px;
//           border: 1px solid #dee2e6;
//           padding: 0.5rem 1rem;
//           font-size: 14px;
//         }
//         .form-select:focus, .form-control:focus {
//           border-color: #0d6efd;
//           box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
//         }
//         .input-group-text {
//           border-radius: 8px 0 0 8px;
//           border-right: none;
//         }
//         .input-group .form-control {
//           border-radius: 0 8px 8px 0;
//           border-left: none;
//         }
//         .input-group .form-control:focus {
//           border-left: none;
//           box-shadow: none;
//         }
//         .input-group .form-control:focus + .input-group-text {
//           border-color: #0d6efd;
//         }
//       `}</style>
//     </div>
//   );
// } 