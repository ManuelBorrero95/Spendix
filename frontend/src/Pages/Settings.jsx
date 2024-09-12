import React, { useState, useEffect } from 'react';
import { Card, Button, TextInput, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Settings = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [balanceResponse, categoriesResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/balance`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setBalance(balanceResponse.data.currentAmount.toString());
      setCategories(categoriesResponse.data.filter(category => category.createdBy));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Errore nel caricamento dei dati. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/api/balance`, { balance }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Bilancio aggiornato con successo!');
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Errore nell\'aggiornamento del bilancio. Riprova più tardi.');
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/categories`, { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Errore nell\'aggiunta della categoria. Riprova più tardi.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(category => category._id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Errore nell\'eliminazione della categoria. Riprova più tardi.');
    }
  };

  const handleRenameCategory = async (categoryId, newName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BACKEND_URL}/api/categories/${categoryId}`, { name: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.map(category => 
        category._id === categoryId ? response.data : category
      ));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error renaming category:', error);
      setError('Errore nella rinomina della categoria. Riprova più tardi.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#001845]">
        <Spinner size="xl" className="text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001845] text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Impostazioni</h1>
          <Button onClick={() => navigate('/dashboard')} className="bg-[#0466C8] hover:bg-[#0353A4]">
            Torna alla Dashboard
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white">
            <h2 className="text-2xl font-semibold mb-4">Aggiorna bilancio iniziale</h2>
            <div className="flex items-center space-x-4">
              <TextInput
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Nuovo bilancio"
                className="flex-grow"
              />
              <Button onClick={handleUpdateBalance} className="bg-[#0466C8] hover:bg-[#0353A4]">
                Aggiorna
              </Button>
            </div>
          </Card>

          <Card className="bg-white">
            <h2 className="text-2xl font-semibold mb-4">Aggiungi Nuova Categoria</h2>
            <div className="flex items-center space-x-4">
              <TextInput
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nuova categoria"
                className="flex-grow"
              />
              <Button onClick={handleAddCategory} className="bg-[#0466C8] hover:bg-[#0353A4]">
                Aggiungi
              </Button>
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-white">Le Tue Categorie</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category._id} className="bg-white">
              <div className="mb-4">
                <label htmlFor={`category-${category._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Nome categoria
                </label>
                {editingCategory === category._id ? (
                  <TextInput
                    id={`category-${category._id}`}
                    value={category.name}
                    onChange={(e) => setCategories(categories.map(c => 
                      c._id === category._id ? {...c, name: e.target.value} : c
                    ))}
                    className="w-full"
                  />
                ) : (
                  <h5 className="text-xl font-bold tracking-tight text-gray-900">
                    {category.name}
                  </h5>
                )}
              </div>
              <div className="flex justify-between items-center space-x-2">
                {editingCategory === category._id ? (
                  <>
                    <Button onClick={() => handleRenameCategory(category._id, category.name)} className="flex-1 bg-green-500 hover:bg-green-600">
                      Salva
                    </Button>
                    <Button onClick={() => setEditingCategory(null)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                      Annulla
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditingCategory(category._id)} className="flex-1 bg-[#0466C8] hover:bg-[#0353A4]">
                      Rinomina
                    </Button>
                    <Button onClick={() => handleDeleteCategory(category._id)} className="flex-1 bg-red-500 hover:bg-red-600">
                      Elimina
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;