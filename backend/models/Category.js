import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Casa', 'Bollette', 'Svago'],
    default: 'both'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export default Category;