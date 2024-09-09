import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Balance',
    required: true
  }
}, { timestamps: true });

// Middleware per aggiornare il bilancio dopo il salvataggio di una transazione
TransactionSchema.post('save', async function(doc) {
  const Balance = mongoose.model('Balance');
  await Balance.findByIdAndUpdate(doc.balance, {
    $inc: { currentAmount: doc.amount },
    lastUpdated: doc.date
  });
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;