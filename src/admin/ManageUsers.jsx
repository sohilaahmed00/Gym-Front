import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageUsers() {
  // حالة المستخدمين
  const [users, setUsers] = useState([]);

  // جلب بيانات المستخدمين من API (مثال وهمي)
  useEffect(() => {
    setUsers([
      { id: 1, name: 'عمر خالد', email: 'omar@email.com', joined: '2023-02-15', status: 'نشط' },
      { id: 2, name: 'منى عادل', email: 'mona@email.com', joined: '2022-12-01', status: 'نشط' },
      { id: 3, name: 'يوسف سامي', email: 'youssef@email.com', joined: '2022-10-20', status: 'غير نشط' },
    ]);
  }, []);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">إدارة المستخدمين</h4>
          <button className="btn btn-primary">
            <i className="fas fa-plus ms-2"></i>
            إضافة مستخدم جديد
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th className="text-end">الاسم</th>
                <th className="text-end">البريد الإلكتروني</th>
                <th className="text-end">تاريخ الانضمام</th>
                <th className="text-end">الحالة</th>
                <th className="text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="text-end">
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: '#6c757d22',
                        color: '#6c757d',
                        fontSize: 20,
                        marginRight: 6,
                      }}>
                        <i className="fas fa-user"></i>
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{user.name}</span>
                    </span>
                  </td>
                  <td className="text-end">{user.email}</td>
                  <td className="text-end">{user.joined}</td>
                  <td className="text-end">
                    <span className={`badge ${user.status === 'نشط' ? 'bg-success' : 'bg-danger'} text-white`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-edit ms-1"></i>
                        تعديل
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash ms-1"></i>
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .user-row:hover { background: #f1f3f6; transition: background 0.2s; }
        .badge {
          font-weight: 500;
          padding: 6px 10px;
        }
        .table th {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-group .btn {
          padding: 0.4rem 0.8rem;
        }
      `}</style>
    </div>
  );
} 