import React, { useState, useEffect } from 'react';
import type { Recipe, Category } from '../../types';
import { parseRecipeText } from '../../utils/recipeParser';

interface RecipeFormProps {
  categories: Category[];
  initialRecipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ categories, initialRecipe, onSave, onCancel }) => {
  const [mode, setMode] = useState<'manual' | 'paste'>('manual');
  const [pasteText, setPasteText] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [servings, setServings] = useState<number | null>(null);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredientsRaw, setIngredientsRaw] = useState('');
  const [instructionsRaw, setInstructionsRaw] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Pre-fill form if editing
  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title);
      setSourceUrl(initialRecipe.sourceUrl || '');
      setServings(initialRecipe.servings ?? null);
      setPrepTime(initialRecipe.prepTime || '');
      setCookTime(initialRecipe.cookTime || '');
      setIngredientsRaw(initialRecipe.ingredients.join('\n'));
      setInstructionsRaw(initialRecipe.instructions.join('\n'));
      setNotes(initialRecipe.notes || '');
      setSelectedCategoryIds(initialRecipe.categoryIds);
    }
  }, [initialRecipe]);

  const handleParse = () => {
    const parsed = parseRecipeText(pasteText);
    
    if (parsed.title) setTitle(parsed.title);
    if (parsed.ingredients) setIngredientsRaw(parsed.ingredients.join('\n'));
    if (parsed.instructions) setInstructionsRaw(parsed.instructions.join('\n'));
    if (parsed.servings) setServings(parsed.servings);
    
    setWarnings(parsed.warnings);
    setMode('manual');
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData: Recipe = {
      id: initialRecipe?.id || crypto.randomUUID(),
      userId: initialRecipe?.userId || 'local-user',
      title,
      sourceUrl: sourceUrl.trim(),
      servings: servings ?? null,
      prepTime: prepTime.trim(),
      cookTime: cookTime.trim(),
      ingredients: ingredientsRaw.split('\n').filter(i => i.trim() !== ''),
      instructions: instructionsRaw.split('\n').filter(i => i.trim() !== ''),
      notes: notes.trim(),
      categoryIds: selectedCategoryIds,
      createdAt: initialRecipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(recipeData);
  };

  if (mode === 'paste') {
    return (
      <div className="recipe-form">
        <h2>Paste Recipe Text</h2>
        <p className="hint">Paste the raw text from a website or document.</p>
        <div className="form-group">
          <label htmlFor="paste-area">Recipe Text</label>
          <textarea
            id="paste-area"
            rows={15}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste recipe here..."
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => setMode('manual')}>Cancel</button>
          <button type="button" className="primary" onClick={handleParse}>Parse Recipe</button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-form">
      <div className="form-header">
        <h2>{initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        {!initialRecipe && (
          <button type="button" onClick={() => setMode('paste')} className="secondary">
            Paste from Text
          </button>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="parse-warnings">
          <h4>Review Required</h4>
          <ul>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
          <button onClick={() => setWarnings([])} className="dismiss-btn">Dismiss Warnings</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sourceUrl">Source URL</label>
          <input
            id="sourceUrl"
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="servings">Servings</label>
            <input
              id="servings"
              type="number"
              value={servings ?? ''}
              onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prepTime">Prep Time</label>
            <input
              id="prepTime"
              type="text"
              placeholder="e.g. 15 mins"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cookTime">Cook Time</label>
            <input
              id="cookTime"
              type="text"
              placeholder="e.g. 30 mins"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Categories</label>
          <div className="category-selection">
            {categories.length === 0 ? (
              <p className="hint">No categories created yet. Add some in the Categories tab!</p>
            ) : (
              categories.map(cat => (
                <label key={cat.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  />
                  {cat.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients (one per line) *</label>
          <textarea
            id="ingredients"
            rows={5}
            value={ingredientsRaw}
            onChange={(e) => setIngredientsRaw(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions (one per line) *</label>
          <textarea
            id="instructions"
            rows={5}
            value={instructionsRaw}
            onChange={(e) => setInstructionsRaw(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary">
            {initialRecipe ? 'Update Recipe' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
