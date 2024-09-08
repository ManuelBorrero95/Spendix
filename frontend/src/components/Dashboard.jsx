import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    console.log('Token ricevuto:', token);

    if (token) {
      localStorage.setItem('token', token);      
      console.log('Token salvato:', token);
      navigate('/dashboard', { replace: true }); // Rimuove il token dall'URL

    }
    else{
      console.log('Nessun token trovato nell\'URL');
    }
    
    // Verifica se l'utente è autenticato
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
    } else {
    }
  }, [location, navigate]);



  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };


  return (
    <div className="min-h-screen bg-[rgb(4,18,51)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Benvenuto nella tua dashboard</h1>
        <p className="mb-4"></p>
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