import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, Table, Button, Spinner } from 'flowbite-react';
import { HiArrowUp, HiArrowDown, HiOutlineLogout } from 'react-icons/hi';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }

    fetchUserData();
  }, [location, navigate]);

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
      setBalance(response.data.balance?.currentAmount || 0);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
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
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard di {user?.name}</h1>
            <Button color="failure" onClick={handleLogout}>
              <HiOutlineLogout className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <h2 className="text-xl font-semibold mb-2">Bilancio Attuale</h2>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                €{balance.toFixed(2)}
              </p>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold mb-2">Transazioni Recenti</h2>
              <p className="text-lg">Totale: {transactions.length}</p>
            </Card>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Data</Table.HeadCell>
              <Table.HeadCell>Descrizione</Table.HeadCell>
              <Table.HeadCell>Categoria</Table.HeadCell>
              <Table.HeadCell>Importo</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {transactions.map((transaction) => (
                <Table.Row key={transaction._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(transaction.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell>{transaction.category?.name || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <span className={`flex items-center ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? <HiArrowUp className="mr-1" /> : <HiArrowDown className="mr-1" />}
                      €{Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;