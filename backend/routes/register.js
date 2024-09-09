import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Balance from '../models/Balance.js';


const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Controlla se l'utente esiste già
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'L\'utente esiste già' });
    }

    //creo nuovo bilancio a 0
    const newBalance = new Balance({ currentAmount: 0 });
    await newBalance.save();

    // Crea un nuovo utente
    user = new User({
      name,
      email,
      password,
      Balace: newBalance._id
    });

    // Salva l'utente nel database
    await user.save();

    // Crea e invia il token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

export default router;