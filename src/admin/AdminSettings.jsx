// import React from 'react';
// import { useNavigate, Outlet } from 'react-router-dom';

// const settingsCategories = [
//   { 
//     id: 'account', 
//     title: 'Account Settings',
//     description: 'Change email, password, manage permissions, two-factor authentication.',
//     icon: 'fas fa-user-cog',
//     path: 'account'
//   },
//   { 
//     id: 'site', 
//     title: 'Site Settings',
//     description: 'Site name, logo, primary colors, social media links, contact information.',
//     icon: 'fas fa-sitemap',
//     path: 'site' 
//   },
//   { 
//     id: 'payment', 
//     title: 'Payment Settings',
//     description: 'Payment methods, currency, coach commission rates, refund policy.',
//     icon: 'fas fa-credit-card',
//     path: 'payment' 
//   },
//   { 
//     id: 'system', 
//     title: 'System Settings',
//     description: 'Notifications, automated tasks, languages, backup & restore, performance.',
//     icon: 'fas fa-cogs',
//     path: 'system' 
//   },
//   { 
//     id: 'content', 
//     title: 'Content Settings',
//     description: 'Terms of use, privacy policy, manage static pages, handle reports/complaints.',
//     icon: 'fas fa-file-alt',
//     path: 'content' 
//   },
// ];

// const SettingsCategoryCard = ({ category }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="col-md-6 col-lg-4 mb-4">
//       <div className="card h-100 shadow-sm custom-card-hover" onClick={() => navigate(category.path)} style={{cursor: 'pointer'}}>
//         <div className="card-body d-flex flex-column">
//           <div className="d-flex align-items-center mb-3">
//             <i className={`${category.icon} fa-2x text-orange me-3`}></i>
//             <h5 className="card-title mb-0 fw-bold">{category.title}</h5>
//           </div>
//           <p className="card-text text-muted small flex-grow-1">{category.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminSettings = () => {
//   return (
//     <div className="container mt-4">
//       <h3 className="mb-4 text-orange fw-bold"><i className="fas fa-tools me-2"></i>General Admin Settings</h3>
//       <div className="row">
//         {settingsCategories.map(category => (
//           <SettingsCategoryCard key={category.id} category={category} />
//         ))}
//       </div>
//       <div className="mt-4 p-3 bg-light rounded">
//         <Outlet /> 
//       </div>
//     </div>
//   );
// };

// // Placeholder components for sub-routes
// export const AccountSettings = () => <div className='p-3'><h4>Account Settings</h4><p>Account settings content here...</p></div>;
// export const SiteSettings = () => <div className='p-3'><h4>Site Settings</h4><p>Site settings content here...</p></div>;
// export const PaymentSettings = () => <div className='p-3'><h4>Payment Settings</h4><p>Payment settings content here...</p></div>;
// export const SystemSettings = () => <div className='p-3'><h4>System Settings</h4><p>System settings content here...</p></div>;
// export const ContentSettings = () => <div className='p-3'><h4>Content Settings</h4><p>Content settings content here...</p></div>;

// export default AdminSettings;
