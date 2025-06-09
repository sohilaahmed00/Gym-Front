import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminChart from './components/AdminChart';

function App() {
  return (
    <Routes>
      <Route path="/admin/chart" element={<AdminChart />} />
    </Routes>
  );
}

export default App; 