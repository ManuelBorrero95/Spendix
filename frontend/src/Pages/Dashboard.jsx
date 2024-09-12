import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, Table, Button, Spinner, Modal } from 'flowbite-react';
import { HiArrowUp, HiArrowDown, HiPlus } from 'react-icons/hi';
import ApexCharts from 'apexcharts';
import AddTransactionForm from '../components/AddTransactionForm';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      const [userResponse, categoriesResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUser(userResponse.data);
      setBalance(userResponse.data.balance?.currentAmount || 0);
      setCategories(categoriesResponse.data);
      
      const transactionsWithCategories = userResponse.data.transactions.map(transaction => {
        const categoryId = typeof transaction.category === 'object' && transaction.category !== null
          ? transaction.category._id
          : transaction.category;
        
        const category = categoriesResponse.data.find(cat => cat._id === categoryId);
        
        return { 
          ...transaction, 
          category: category ? category.name : 'N/A',
          categoryId: categoryId
        };
      });
      
      setTransactions(transactionsWithCategories);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Errore nel caricamento dei dati. Riprova più tardi.');
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    }

    fetchUserData();
  }, [location, navigate, fetchUserData]);

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      renderPieChart();
    }
  }, [loading, transactions]);

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

  const renderPieChart = () => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'spesa')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        return acc;
      }, {});

    const series = Object.values(expensesByCategory);
    const labels = Object.keys(expensesByCategory);

    if (series.length === 0) {
      console.log('No data to display in the pie chart');
      return;
    }

    const options = {
      series: series,
      chart: {
        height: 420,
        type: "pie",
      },
      labels: labels,
      colors: ["#1C64F2", "#16BDCA", "#9061F9", "#FFA500", "#FF6347", "#4B0082", "#008000", "#FF1493"],
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    const chartElement = document.getElementById("pie-chart");
    if (chartElement && typeof ApexCharts !== 'undefined') {
      chartElement.innerHTML = '';
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  };

  const getTransactionsSummary = () => {
    const income = transactions.filter(t => t.type === 'guadagno').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'spesa').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expenses };
  };

  const handleAddTransaction = () => {
    setShowAddTransactionModal(true);
  };

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    setBalance(prevBalance => prevBalance + newTransaction.amount);
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#001845]">
        <Spinner size="xl" className="text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#001845] text-white">
        <p>{error}</p>
      </div>
    );
  }

  const { income, expenses } = getTransactionsSummary();

  return (
    <div className="bg-[#001845] min-h-screen flex flex-col text-black">
      <NavbarComponent user={user} onLogout={handleLogout} />

      <div className="flex-grow p-4 max-w-5xl mx-auto w-full">
        <Card className="bg-white text-black mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard di {user?.name}</h1>
            <Button color="success" onClick={handleAddTransaction}>
              <HiPlus className="mr-2 h-5 w-5" />
              Aggiungi Transazione
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <h2 className="text-xl font-semibold mb-2">Bilancio Attuale</h2>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                €{balance.toFixed(2)}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Resoconto Transazioni</h3>
                <p className="text-green-500">Entrate: €{income.toFixed(2)}</p>
                <p className="text-red-500">Uscite: €{expenses.toFixed(2)}</p>
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold mb-2">Distribuzione Spese</h2>
              <div id="pie-chart"></div>
            </Card>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell className="bg-[#0353A4] text-white">Data</Table.HeadCell>
                <Table.HeadCell className="bg-[#0353A4] text-white">Descrizione</Table.HeadCell>
                <Table.HeadCell className="bg-[#0353A4] text-white">Categoria</Table.HeadCell>
                <Table.HeadCell className="bg-[#0353A4] text-white">Importo</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200">
                {transactions.slice(0, 5).map((transaction) => (
                  <Table.Row key={transaction._id} className="bg-white">
                    <Table.Cell>{new Date(transaction.date).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{transaction.description}</Table.Cell>
                    <Table.Cell>{transaction.category}</Table.Cell>
                    <Table.Cell>
                      <span className={`flex items-center ${transaction.type === 'guadagno' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'guadagno' ? <HiArrowUp className="mr-1" /> : <HiArrowDown className="mr-1" />}
                        €{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Card>
      </div>

      <FooterComponent />

      <Modal show={showAddTransactionModal} onClose={() => setShowAddTransactionModal(false)}>
        <Modal.Body>
          <AddTransactionForm 
            onTransactionAdded={handleTransactionAdded}
            onClose={() => setShowAddTransactionModal(false)}
            categories={categories}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;