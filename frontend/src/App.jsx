import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Dashboard from './Pages/Dashboard';
import RegisterPage from './Pages/RegisterPage';
import LandingPage  from './Pages/LandingPage';
import ProfilePage from './Pages/ProfilePage';
import Settings from './Pages/Settings';
import SetInitialBalancePage from './Pages/SetInitialBalancePage';
import 'flowbite/dist/flowbite.min.css';
import 'apexcharts/dist/apexcharts.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/set-initial-balance" element={<SetInitialBalancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;