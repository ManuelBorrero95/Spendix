import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const router = express.Router();

const FRONTEND_URL =  process.env.BACKEND_URL || 'http://localhost:5173';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    console.log(`${FRONTEND_URL}/dashboard?token=${token}`);
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(FRONTEND_URL);
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ status: 'success', token, user: { id: user._id, name: user.name, email: user.email } });
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