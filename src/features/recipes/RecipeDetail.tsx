import React from 'react';
import type { Recipe, Category } from '../../types';

interface RecipeDetailProps {
  recipe: Recipe;
  categories: Category[];
  onClose: () => void;
  onDelete: (recipeId: string) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, categories, onClose, onDelete }) => {
  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"? This will also remove it from any meal plans.`)) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} title="Close">×</button>
        
        <header className="modal-header">
          <div className="header-actions">
            <h2>{recipe.title}</h2>
            <button className="danger" onClick={handleDelete}>Delete Recipe</button>
          </div>
          <div className="card-categories">
            {recipe.categoryIds.map(id => (
              <span key={id} className="category-tag">
                {getCategoryName(id)}
              </span>
            ))}
          </div>
        </header>

        <div className="modal-body">
          <div className="recipe-meta detail-meta">
            {recipe.servings && <span>{recipe.servings} servings</span>}
            {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
            {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
            {recipe.sourceUrl && (
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                Original Source
              </a>
            )}
          </div>

          <section className="detail-section">
            <h3>Ingredients</h3>
            <ul className="detail-list">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section">
            <h3>Instructions</h3>
            <ol className="detail-list ordered">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          {recipe.notes && (
            <section className="detail-section notes-section">
              <h3>Notes</h3>
              <p>{recipe.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
