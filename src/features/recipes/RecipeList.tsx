import React, { useState } from 'react';
import type { Recipe, Category } from '../../types';
import RecipeDetail from './RecipeDetail';

interface RecipeListProps {
  recipes: Recipe[];
  categories: Category[];
  onEdit: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, categories, onEdit }) => {
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = filterCategoryId === 'all' || r.categoryIds.includes(filterCategoryId);
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  const handleEditClick = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  return (
    <div className="recipe-list">
      <div className="list-header">
        <h2>My Recipes ({filteredRecipes.length})</h2>
        <div className="filter-controls">
          <div className="search-box">
            <label htmlFor="recipe-search" className="visually-hidden">Search recipes</label>
            <input 
              id="recipe-search"
              type="text" 
              placeholder="Search recipes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <label htmlFor="category-filter">Filter by:</label>
            <select 
              id="category-filter"
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="empty-state">
          {recipes.length === 0 
            ? "No recipes yet. Add one to get started!" 
            : "No recipes found for this category."}
        </p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="recipe-card clickable" 
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="card-header">
                <h3>{recipe.title}</h3>
                <button 
                  className="edit-btn" 
                  onClick={(e) => handleEditClick(e, recipe)}
                  title="Edit Recipe"
                >
                  Edit
                </button>
              </div>
              
              <div className="card-categories">
                {recipe.categoryIds.map(id => (
                  <span key={id} className="category-tag">
                    {getCategoryName(id)}
                  </span>
                ))}
              </div>

              {recipe.sourceUrl && (
                <p className="source-link">
                  <span className="source-tag">Source available</span>
                </p>
              )}
              
              <div className="recipe-meta">
                {recipe.servings && <span>{recipe.servings} servings</span>}
                {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
                {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
              </div>
              
              <div className="recipe-preview">
                <p>{recipe.ingredients.length} ingredients • {recipe.instructions.length} steps</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          categories={categories} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
};

export default RecipeList;
