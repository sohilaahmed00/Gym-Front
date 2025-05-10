import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageProducts = () => {
  const products = [
    {
      name: "جلسة تدريب شخصي",
      category: "تدريب",
      type: "خدمة",
      srmProduct: "نعم",
      price: 200.00
    },
    {
      name: "جلسة تدريب جماعي",
      category: "تدريب",
      type: "خدمة",
      srmProduct: "نعم",
      price: 100.00
    },
    {
      name: "بروتين شيك",
      category: "مكملات",
      type: "منتج",
      srmProduct: "نعم",
      price: 45.00
    },
    {
      name: "مكمل BCAA",
      category: "مكملات",
      type: "منتج",
      srmProduct: "نعم",
      price: 120.00
    },
    {
      name: "مكمل ما قبل التمرين",
      category: "مكملات",
      type: "منتج",
      srmProduct: "نعم",
      price: 85.00
    },
    {
      name: "منشفة صالة رياضية",
      category: "مستلزمات",
      type: "منتج",
      srmProduct: "نعم",
      price: 25.00
    },
    {
      name: "زجاجة ماء",
      category: "مستلزمات",
      type: "منتج",
      srmProduct: "نعم",
      price: 35.00
    },
    {
      name: "سجادة يوغا",
      category: "مستلزمات",
      type: "منتج",
      srmProduct: "نعم",
      price: 150.00
    },
    {
      name: "طقم أحزمة مقاومة",
      category: "معدات",
      type: "منتج",
      srmProduct: "نعم",
      price: 75.00
    },
    {
      name: "حبل قفز",
      category: "معدات",
      type: "منتج",
      srmProduct: "نعم",
      price: 40.00
    },
    {
      name: "رولر فوم",
      category: "معدات",
      type: "منتج",
      srmProduct: "نعم",
      price: 60.00
    }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">إدارة المنتجات</h4>
            <button className="btn btn-primary">
              <i className="fas fa-plus ms-2"></i>
              إضافة منتج جديد
            </button>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 text-end">اسم المنتج</th>
                  <th className="border-0 text-end">الفئة</th>
                  <th className="border-0 text-end">النوع</th>
                  <th className="border-0 text-end">منتج SRM</th>
                  <th className="border-0 text-end">السعر</th>
                  <th className="border-0 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="product-row">
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
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#e9ecef',
                          color: '#495057',
                          fontSize: 18,
                        }}>
                          <i className="fas fa-box"></i>
                        </span>
                        <span style={{ fontWeight: 500, fontSize: 15 }}>{product.name}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <span className="badge bg-light text-dark">
                        {product.category}
                      </span>
                    </td>
                    <td className="text-end">
                      <span className={`badge ${product.type === 'اشتراك' ? 'bg-primary' : product.type === 'خدمة' ? 'bg-success' : 'bg-info'}`}>
                        {product.type}
                      </span>
                    </td>
                    <td className="text-end">
                      <span className={`badge ${product.srmProduct === 'نعم' ? 'bg-success' : 'bg-danger'}`}>
                        {product.srmProduct}
                      </span>
                    </td>
                    <td className="text-end">
                      <span className="fw-bold">${product.price?.toFixed(2)}</span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-edit ms-1"></i>
                          تعديل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        .product-row:hover { 
          background: #f8f9fa; 
          transition: all 0.2s ease;
        }
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
};

export default ManageProducts;
