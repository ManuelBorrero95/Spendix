import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Balance from '../models/Balance.js';

dotenv.config();

const router = express.Router();

const FRONTEND_URL =  process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('balance');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      if (!user.balance) {
        // L'utente non ha un bilancio, reindirizza alla pagina di impostazione del bilancio
        return res.redirect(`${FRONTEND_URL}/set-initial-balance?token=${token}`);
      }

      // L'utente ha già un bilancio, reindirizza alla dashboard
      res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Errore durante l\'autenticazione Google:', error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(FRONTEND_URL);
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('balance');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Verifica se l'utente ha un bilancio
    if (!user.balance) {
      return res.status(200).json({ 
        status: 'success', 
        token, 
        user: { id: user._id, name: user.name, email: user.email },
        needsInitialBalance: true
      });
    }

    res.status(200).json({ 
      status: 'success', 
      token, 
      user: { id: user._id, name: user.name, email: user.email },
      needsInitialBalance: false
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({ status: 'success', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
});


export default router;