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
    // Non è richiesto per l'autenticazione Google
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  balance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Balance'
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
UserSchema.methods.correctPassword = async function(candidatePassword, UserPassword) {
  return await bcrypt.compare(candidatePassword, UserPassword);
};

const User = mongoose.model('User', UserSchema);

export default User;