import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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