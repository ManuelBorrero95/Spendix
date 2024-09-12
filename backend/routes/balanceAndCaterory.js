import express from 'express';
import Balance from '../models/Balance.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance) {
      return res.status(404).json({ message: 'Bilancio non trovato' });
    }
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del bilancio' });
  }
});

// Update balance
router.put('/balance', authenticateToken, async (req, res) => {
  try {
    const { balance } = req.body;
    const updatedBalance = await Balance.findOneAndUpdate(
      { user: req.user.id },
      { currentAmount: balance },
      { new: true }
    );
    if (!updatedBalance) {
      return res.status(404).json({ message: 'Bilancio non trovato' });
    }
    res.json(updatedBalance);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del bilancio' });
  }
});

// Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find({ $or: [{ isDefault: true }, { createdBy: req.user.id }] });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero delle categorie' });
  }
});

// Add new category
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
    res.status(500).json({ message: 'Errore nella creazione della categoria' });
  }
});

export default router;