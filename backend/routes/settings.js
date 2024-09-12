// Importa le dipendenze necessarie
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Balance from '../models/Balance.js';
import Category from '../models/Category.js';

const router = express.Router();

// Rotta per ottenere il bilancio attuale
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('balance');
    if (!user || !user.balance) {
      return res.status(404).json({ message: 'Bilancio non trovato' });
    }
    res.json({ currentAmount: user.balance.currentAmount });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Rotta per aggiornare il bilancio
router.put('/balance', authenticateToken, async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findById(req.user.id).populate('balance');
    if (!user || !user.balance) {
      return res.status(404).json({ message: 'Bilancio non trovato' });
    }
    user.balance.currentAmount = balance;
    await user.balance.save();
    res.json({ message: 'Bilancio aggiornato con successo', currentAmount: user.balance.currentAmount });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Rotta per ottenere tutte le categorie dell'utente
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find({ createdBy: req.user.id });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Rotta per aggiungere una nuova categoria
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({
      name,
      createdBy: req.user.id
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Rotta per rinominare una categoria
router.put('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error renaming category:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Rotta per eliminare una categoria
router.delete('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!category) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }
    res.json({ message: 'Categoria eliminata con successo' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

export default router;