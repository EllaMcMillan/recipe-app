import React, { useState } from 'react';
import type { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="category-manager">
      <h3>Manage Categories</h3>
      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="category-name" className="visually-hidden">New Category Name</label>
        <input
          id="category-name"
          type="text"
          placeholder="New category name..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
      <div className="category-pill-container">
        {categories.map((cat) => (
          <span key={cat.id} className="category-pill">
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
