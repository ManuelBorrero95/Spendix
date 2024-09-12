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
  isDefault: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return !this.isDefault; }
  }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export const createDefaultCategories = async () => {
  console.log('Starting to create default categories...');
  const defaultCategories = [
    'Ristoranti', 'Acqua', 'Energia Elettrica', 'Riscaldamento',
    'TV/Telefono/Internet', 'Palestra', 'Alimentari', 'Debiti'
  ];

  try {
    for (let categoryName of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      if (existingCategory) {
        console.log(`Category "${categoryName}" already exists.`);
      } else {
        const newCategory = await Category.create({ name: categoryName, isDefault: true });
        console.log(`Created default category: ${newCategory.name}`);
      }
    }
    console.log('Finished creating default categories.');
  } catch (error) {
    console.error('Error creating default categories:', error);
  }

  // Log the total number of categories after creation
  const totalCategories = await Category.countDocuments();
  console.log(`Total number of categories in the database: ${totalCategories}`);
};

export default Category;