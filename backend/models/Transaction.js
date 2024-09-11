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
    enum: ['income', 'expense']
  },
  category: {
    type: String,
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

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;