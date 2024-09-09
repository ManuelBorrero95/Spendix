import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, Table, Button, Spinner, Navbar, Dropdown } from 'flowbite-react';
import { HiArrowUp, HiArrowDown, HiOutlineLogout, HiPlus, HiMenu, HiUser, HiCash } from 'react-icons/hi';
import ApexCharts from 'apexcharts';

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

  useEffect(() => {
    if (!loading && transactions.length > 0) {
      renderPieChart();
    }
  }, [loading, transactions]);

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

  const renderPieChart = () => {
    const categories = transactions.reduce((acc, transaction) => {
      const category = transaction.category?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {});

    const series = Object.values(categories);
    const labels = Object.keys(categories);

    const options = {
      series: series,
      chart: {
        height: 420,
        width: "100%",
        type: "pie",
      },
      labels: labels,
      colors: ["#1C64F2", "#16BDCA", "#9061F9", "#FFA500", "#FF6347"],
      stroke: {
        colors: ["white"],
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25
          }
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2) + "€"
          },
        },
      },
    };

    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("pie-chart"), options);
      chart.render();
    }
  };

  const getTransactionsSummary = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type !== 'income').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expenses };
  };

  const handleAddTransaction = () => {
    // Implementare la logica per aggiungere una nuova transazione
    console.log('Add transaction clicked');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  const { income, expenses } = getTransactionsSummary();

  return (
    <div className="bg-[#001845] min-h-screen text-white">
      <Navbar fluid className="bg-[#001845]">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
            Finance Dashboard
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<HiMenu className="w-6 h-6 text-white" />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user?.name}
              </span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiUser} onClick={() => navigate('/profile')}>
              Profilo
            </Dropdown.Item>
            <Dropdown.Item icon={HiCash} onClick={() => navigate('/transactions')}>
              Transazioni
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiOutlineLogout} onClick={handleLogout}>
              Logout
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>

      <div className="p-4 max-w-5xl mx-auto">
        <Card className="bg-[#FFF] text-[#000]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard di {user?.name}</h1>
            <Button color="success" onClick={handleAddTransaction}>
              <HiPlus className="mr-2 h-5 w-5" />
              Aggiungi Transazione
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="bg-[#0353A4] text-white">
              <h2 className="text-xl font-semibold mb-2">Bilancio Attuale</h2>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                €{balance.toFixed(2)}
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Resoconto Transazioni</h3>
                <p className="text-green-300">Entrate: €{income.toFixed(2)}</p>
                <p className="text-red-300">Uscite: €{expenses.toFixed(2)}</p>
              </div>
            </Card>
            <Card className="bg-[#0353A4] text-white">
              <h2 className="text-xl font-semibold mb-2">Distribuzione Spese</h2>
              <div id="pie-chart"></div>
            </Card>
          </div>
          <Table>
            <Table.Head>
              <Table.HeadCell className="bg-[#0353A4] text-white">Data</Table.HeadCell>
              <Table.HeadCell className="bg-[#0353A4] text-white">Descrizione</Table.HeadCell>
              <Table.HeadCell className="bg-[#0353A4] text-white">Categoria</Table.HeadCell>
              <Table.HeadCell className="bg-[#0353A4] text-white">Importo</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-[#0353A4]">
              {transactions.map((transaction) => (
                <Table.Row key={transaction._id} className="bg-[#0466C8] text-white">
                  <Table.Cell>{new Date(transaction.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell>{transaction.category?.name || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <span className={`flex items-center ${transaction.type === 'income' ? 'text-green-300' : 'text-red-300'}`}>
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