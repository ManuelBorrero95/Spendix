import mongoose from 'mongoose';

const BalanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Balance = mongoose.model('Balance', BalanceSchema);

export default Balance;