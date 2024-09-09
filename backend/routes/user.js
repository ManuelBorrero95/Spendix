import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router();

// Route per ottenere i dati dell'utente per la dashboard
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password') // Esclude il campo password
      .populate('balance')
      .populate({
        path: 'transactions',
        options: { sort: { date: -1 }, limit: 5 }, // Ordina per data decrescente e limita a 5 transazioni
        populate: { path: 'category' } // Popola anche la categoria di ogni transazione
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

export default router;