import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, TextInput, Select } from 'flowbite-react';
import { HiPencil, HiTrash } from 'react-icons/hi';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Errore nel caricamento delle transazioni');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Errore nel caricamento delle categorie:', err);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BACKEND_URL}/api/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(transactions.filter(t => t._id !== id));
      } catch (err) {
        setError('Errore nell\'eliminazione della transazione');
      }
    }
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BACKEND_URL}/api/transactions/${editingTransaction._id}`, 
        editingTransaction,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(transactions.map(t => t._id === editingTransaction._id ? response.data : t));
      setShowEditModal(false);
    } catch (err) {
      setError('Errore nell\'aggiornamento della transazione');
    }
  };

  if (loading) return <div className="text-center mt-8">Caricamento...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#001845] p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-[#0466C8]">Transazioni</h1>
        <Button onClick={() => navigate('/dashboard')} className="mb-4 bg-[#0466C8]">
          Torna alla Dashboard
        </Button>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Data</Table.HeadCell>
              <Table.HeadCell>Descrizione</Table.HeadCell>
              <Table.HeadCell>Categoria</Table.HeadCell>
              <Table.HeadCell>Importo</Table.HeadCell>
              <Table.HeadCell>Tipo</Table.HeadCell>
              <Table.HeadCell>Azioni</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {transactions.map((transaction) => (
                <Table.Row key={transaction._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(transaction.date).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell>{transaction.category.name}</Table.Cell>
                  <Table.Cell>€{Math.abs(transaction.amount).toFixed(2)}</Table.Cell>
                  <Table.Cell>{transaction.type === 'spesa' ? 'Spesa' : 'Guadagno'}</Table.Cell>
                  <Table.Cell>
                    <Button.Group>
                      <Button color="gray" onClick={() => handleEdit(transaction)}>
                        <HiPencil className="mr-2 h-5 w-5" />
                        Modifica
                      </Button>
                      <Button color="failure" onClick={() => handleDelete(transaction._id)}>
                        <HiTrash className="mr-2 h-5 w-5" />
                        Elimina
                      </Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Modifica Transazione</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateTransaction} className="space-y-4">
            <div>
              <label htmlFor="description" className="block mb-2">Descrizione</label>
              <TextInput
                id="description"
                value={editingTransaction?.description || ''}
                onChange={(e) => setEditingTransaction({...editingTransaction, description: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block mb-2">Importo</label>
              <TextInput
                id="amount"
                type="number"
                value={Math.abs(editingTransaction?.amount || 0)}
                onChange={(e) => setEditingTransaction({...editingTransaction, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block mb-2">Tipo</label>
              <Select
                id="type"
                value={editingTransaction?.type || ''}
                onChange={(e) => setEditingTransaction({...editingTransaction, type: e.target.value})}
                required
              >
                <option value="spesa">Spesa</option>
                <option value="guadagno">Guadagno</option>
              </Select>
            </div>
            <div>
              <label htmlFor="category" className="block mb-2">Categoria</label>
              <Select
                id="category"
                value={editingTransaction?.category._id || ''}
                onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})}
                required
              >
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </Select>
            </div>
            <Button type="submit" color="success">Aggiorna Transazione</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TransactionsPage;