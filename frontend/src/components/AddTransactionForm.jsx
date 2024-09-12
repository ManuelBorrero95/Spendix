import React, { useState } from 'react';
import { Button, Label, TextInput, Select } from 'flowbite-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddTransactionForm = ({ onTransactionAdded, onClose, categories }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'spesa',
    category: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/transactions`, {
        amount: formData.type === 'spesa' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
        description: formData.description,
        type: formData.type,
        category: formData.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onTransactionAdded(response.data);
      onClose();
    } catch (err) {
      console.error('Errore durante l\'aggiunta della transazione:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore durante l\'aggiunta della transazione');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Aggiungi Transazione</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div>
        <Label htmlFor="amount">Importo</Label>
        <TextInput
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrizione</Label>
        <TextInput
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select 
          id="type" 
          name="type"
          value={formData.type} 
          onChange={handleInputChange}
        >
          <option value="spesa">Spesa</option>
          <option value="guadagno">Guadagno</option>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          id="category" 
          name="category"
          value={formData.category} 
          onChange={handleInputChange}
          required
        >
          <option value="">Seleziona una categoria</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} color="gray">Annulla</Button>
        <Button type="submit" color="success">Aggiungi</Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;