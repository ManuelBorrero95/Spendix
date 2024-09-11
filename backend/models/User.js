import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: function() { return !this.googleId; }
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  balance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Balance'
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', UserSchema);

export default User;