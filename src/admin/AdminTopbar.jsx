import React from 'react';

export default function AdminTopbar() {
  return (
    <div
      className="d-flex align-items-center"
      style={{
        minHeight: 80,
        padding: '0 32px',
        boxShadow: '0 2px 8px #f1f3f6',
        justifyContent: 'flex-start',
        background: '#fff'
      }}
    >
      <div style={{ maxWidth: 500, width: '100%' }}>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="ابحث في لوحة الإدارة..."
            style={{
              borderRadius: 30,
              fontSize: 18,
              paddingRight: 24,
              paddingLeft: 48,
              width: '100%',
              textAlign: 'right'
            }}
          />
          <button 
            className="btn" 
            style={{ 
              borderRadius: '50%', 
              width: 48, 
              height: 48,
              backgroundColor: '#FF5722',
              border: 'none',
              color: 'white',
              marginRight: -24
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 