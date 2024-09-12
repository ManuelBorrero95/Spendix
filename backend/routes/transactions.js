import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Balance from '../models/Balance.js';

const router = express.Router();

// Get all transactions for the authenticated user
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('category')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Errore nel recupero delle transazioni' });
  }
});

// Update a transaction
router.put('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, type, category } = req.body;

    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transazione non trovata' });
    }

    const oldAmount = transaction.amount;
    const newAmount = type === 'spesa' ? -Math.abs(amount) : Math.abs(amount);

    transaction.amount = newAmount;
    transaction.description = description;
    transaction.type = type;
    transaction.category = category;

    await transaction.save();

    // Update user's balance
    const user = await User.findById(req.user.id).populate('balance');
    user.balance.currentAmount += (newAmount - oldAmount);
    await user.balance.save();

    // Populate the category before sending the response
    await transaction.populate('category');

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento della transazione' });
  }
});

// Delete a transaction
router.delete('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transazione non trovata' });
    }

    // Update user's balance
    const user = await User.findById(req.user.id).populate('balance');
    user.balance.currentAmount -= transaction.amount;
    await user.balance.save();

    // Remove transaction from user's transactions array
    user.transactions = user.transactions.filter(t => t.toString() !== id);
    await user.save();

    // Delete the transaction
    await Transaction.findByIdAndDelete(id);

    res.json({ message: 'Transazione eliminata con successo' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione della transazione' });
  }
});

export default router;