import express from 'express';
import Category from '../models/Category.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found in the database');
    }
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create a new category
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name, createdBy: req.user.id });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating new category:', error);
    res.status(500).json({ message: 'Error creating new category' });
  }
});

export default router;