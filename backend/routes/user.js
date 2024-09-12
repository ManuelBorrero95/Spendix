import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Balance from '../models/Balance.js';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotta per impostare il bilancio iniziale
router.post('/set-initial-balance', authenticateToken, async (req, res) => {
  try {
    const { initialBalance } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    if (user.balance) {
      return res.status(400).json({ message: 'L\'utente ha già un bilancio impostato' });
    }

    const newBalance = new Balance({
      currentAmount: initialBalance,
      user: userId
    });
    await newBalance.save();

    user.balance = newBalance._id;
    await user.save();

    res.status(200).json({ message: 'Bilancio iniziale impostato con successo', balance: newBalance });
  } catch (error) {
    console.error('Errore nell\'impostazione del bilancio iniziale:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Route per ottenere i dati dell'utente per la dashboard
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('balance')
      .populate({
        path: 'transactions',
        options: { sort: { date: -1 }, limit: 5 },
        populate: { path: 'category' }
      });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.json({
      name: user.name,
      email: user.email,
      balance: user.balance,
      transactions: user.transactions
    });
  } catch (error) {
    console.error('Errore nel recupero dei dati utente:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// Route per aggiungere una nuova transazione
router.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { amount, description, type, category } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).populate('balance');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Verifica se la categoria esiste
    let categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    const newTransaction = new Transaction({
      amount: type === 'spesa' ? -Math.abs(amount) : Math.abs(amount),
      description,
      type,
      category: categoryDoc._id,
      user: userId,
      balance: user.balance._id
    });

    await newTransaction.save();

    // Aggiorna il bilancio dell'utente
    user.balance.currentAmount += newTransaction.amount;
    await user.balance.save();

    // Aggiungi la transazione all'array delle transazioni dell'utente
    user.transactions.push(newTransaction._id);
    await user.save();

    // Popola la categoria nella risposta
    await newTransaction.populate('category');

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Errore nell\'aggiunta della transazione:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});


export default router;