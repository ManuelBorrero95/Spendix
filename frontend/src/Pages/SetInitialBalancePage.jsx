import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SetInitialBalancePage = () => {
  const [initialBalance, setInitialBalance] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [location]);

  const handleSetInitialBalance = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/set-initial-balance`, 
        { initialBalance: parseFloat(initialBalance) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Si è verificato un errore durante l\'impostazione del bilancio iniziale');
    }
  };

  return (
    <div className="min-h-screen bg-[#001845] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Imposta il bilancio iniziale</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSetInitialBalance} className="space-y-4">
          <div>
            <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700">Bilancio iniziale</label>
            <input
              type="number"
              id="initialBalance"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#0466C8] text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Imposta bilancio
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetInitialBalancePage;