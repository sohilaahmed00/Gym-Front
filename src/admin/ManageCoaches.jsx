import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageCoaches() {
  // حالة الكوتشز
  const [coaches, setCoaches] = useState([]);

  // جلب بيانات الكوتشز من API (مثال وهمي)
  useEffect(() => {
    setCoaches([
      { id: 1, name: 'أحمد علي', specialty: 'لياقة بدنية', sessions: 20, rating: 4.8, joined: '2023-01-10' },
      { id: 2, name: 'سارة محمد', specialty: 'يوغا', sessions: 15, rating: 4.6, joined: '2022-11-05' },
      { id: 3, name: 'محمد سمير', specialty: 'بناء أجسام', sessions: 30, rating: 4.9, joined: '2022-09-20' },
    ]);
  }, []);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">إدارة المدربين</h4>
          <button className="btn btn-primary">
            <i className="fas fa-plus ms-2"></i>
            إضافة مدرب جديد
          </button>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th className="text-end">الاسم</th>
                <th className="text-end">التخصص</th>
                <th className="text-end">الجلسات</th>
                <th className="text-end">التقييم</th>
                <th className="text-end">تاريخ الانضمام</th>
                <th className="text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id} className="coach-row">
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
                        background: '#0d6efd22',
                        color: '#0d6efd',
                        fontSize: 20,
                        marginRight: 6,
                      }}>
                        <i className="fas fa-user-tie"></i>
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{coach.name}</span>
                    </span>
                  </td>
                  <td className="text-end">{coach.specialty}</td>
                  <td className="text-end">{coach.sessions}</td>
                  <td className="text-end">
                    <span className="badge bg-success text-white">
                      {coach.rating} <i className="fas fa-star ms-1"></i>
                    </span>
                  </td>
                  <td className="text-end">{coach.joined}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="fas fa-edit ms-1"></i>
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .coach-row:hover { background: #f1f3f6; transition: background 0.2s; }
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