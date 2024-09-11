import React, { useState } from 'react';
import { Button, Label, TextInput, Select } from 'flowbite-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddTransactionForm = ({ onTransactionAdded, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Casa');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/transactions`, {
        amount: type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
        description,
        type,
        category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onTransactionAdded(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Si è verificato un errore durante l'aggiunta della transazione`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Aggiungi Transazione</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="amount">Importo</Label>
        <TextInput
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descrizione</Label>
        <TextInput
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Spesa</option>
          <option value="income">Guadagno</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Casa">Casa</option>
          <option value="Bollette">Bollette</option>
          <option value="Svago">Svago</option>
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