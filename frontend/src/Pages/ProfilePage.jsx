import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, TextInput, Spinner } from 'flowbite-react';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Errore nel caricamento dei dati utente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/api/user`, 
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setSuccessMessage('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error.response?.data?.message || 'Errore nell\'aggiornamento del profilo');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#001845]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001845] flex flex-col">
      <NavbarComponent user={user} onLogout={handleLogout} />

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Profilo Utente</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome
              </label>
              <TextInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" color="blue">
              Aggiorna Profilo
            </Button>
          </form>
          <Button color="light" onClick={() => navigate('/dashboard')} className="mt-4">
            Torna alla Dashboard
          </Button>
        </Card>
      </div>

      <FooterComponent />
    </div>
  );
};

export default ProfilePage;