import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true }); // Rimuove il token dall'URL
    }
    
    // Verifica se l'utente è autenticato
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[rgb(4,18,51)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Benvenuto nella tua dashboard</h1>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;