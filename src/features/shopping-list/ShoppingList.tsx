import React, { useState, useMemo } from 'react';
import type { Recipe, MealPlan, GroceryListItem } from '../../types';

interface ShoppingListProps {
  recipes: Recipe[];
  mealPlans: MealPlan[];
  manualItems: GroceryListItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string) => void;
  onDeleteItem: (id: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  recipes, 
  mealPlans, 
  manualItems,
  onToggleItem,
  onAddItem,
  onDeleteItem
}) => {
  const [newItemName, setNewItemName] = useState('');

  // Generate the auto-list from meal plans
  const autoItems = useMemo(() => {
    const items: { name: string, recipeTitle: string, id: string }[] = [];
    
    mealPlans.forEach(plan => {
      const recipe = recipes.find(r => r.id === plan.recipeId);
      if (recipe) {
        recipe.ingredients.forEach((ing, idx) => {
          items.push({
            name: ing.trim(),
            recipeTitle: recipe.title,
            id: `auto-${plan.id}-${idx}`
          });
        });
      }
    });

    return items;
  }, [mealPlans, recipes]);

  // Handle adding manual item
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="shopping-list">
      <h2>Grocery List</h2>
      
      <div className="add-manual-item">
        <form onSubmit={handleAddManual}>
          <label htmlFor="new-grocery-item" className="visually-hidden">New Grocery Item</label>
          <input 
            id="new-grocery-item"
            type="text" 
            placeholder="Add extra item (e.g. Milk)..." 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="list-sections">
        <section className="list-section">
          <h3>Items from Recipes</h3>
          {autoItems.length === 0 ? (
            <p className="hint">No recipes in meal plan yet.</p>
          ) : (
            <ul className="grocery-items">
              {autoItems.map((item) => (
                <li key={item.id} className="grocery-item auto">
                  <div className="item-main">
                    <span className="item-name">{item.name}</span>
                    <span className="item-source">from {item.recipeTitle}</span>
                  </div>
                  {/* Note: Auto-items aren't persisted with 'checked' state in App.tsx 
                      in this simple version unless we treat them like manualItems.
                      For now, let's just display them as a reference list or 
                      we can make them toggleable if we add them to state.
                  */}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="list-section">
          <h3>Manual & Checked Items</h3>
          {manualItems.length === 0 ? (
            <p className="hint">No extra items added.</p>
          ) : (
            <ul className="grocery-items">
              {manualItems.map((item) => (
                <li key={item.id} className={`grocery-item ${item.checked ? 'checked' : ''}`}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => onToggleItem(item.id)} 
                    />
                    <span className="item-name">{item.name}</span>
                  </label>
                  <button className="delete-item-btn" onClick={() => onDeleteItem(item.id)}>×</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default ShoppingList;
