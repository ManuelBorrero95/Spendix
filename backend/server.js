import express, { application } from 'express';
import mongoose from 'mongoose';
import passport from './config/passport.js'
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import registerRoutes from './routes/register.js';
import Category from './models/Category.js';
import Balance from './models/Balance.js';
import Transaction from './models/Transaction.js'
import User from './models/User.js';


dotenv.config();

const app = express();

// NEW! Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'http://localhost:5174', // Frontend in sviluppo
      'https://spendix.vercel.app/', // Frontend in produzione (prendere da vercel!)
      'https://spendix.onrender.com' // URL del backend (prendere da render!)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};

// Middleware
app.use(express.json());


app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Richiesta ricevuta: ${req.method} ${req.path}`);
  next();
});


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/',registerRoutes);
app.use('/api/',userRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;