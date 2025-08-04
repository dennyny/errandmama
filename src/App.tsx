import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import OrderPage from './pages/OrderPage';
import TrackingPage from './pages/TrackingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequestDetails from './pages/AdminRequestDetails';
import { ErrandProvider } from './context/ErrandContext';

function App() {
  return (
    <ErrandProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/order/:serviceType" element={<OrderPage />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/requests/:id" element={<AdminRequestDetails />} />
          </Routes>
        </div>
      </Router>
    </ErrandProvider>
  );
}

export default App;