import React from 'react';
import type { Recipe, MealPlan, MealType } from '../../types';

interface MealPlannerProps {
  recipes: Recipe[];
  mealPlans: MealPlan[];
  onAddMeal: (date: string, type: MealType, recipeId: string) => void;
  onRemoveMeal: (mealPlanId: string) => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ recipes, mealPlans, onAddMeal, onRemoveMeal }) => {
  // Get next 7 days starting from today
  const getDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getDays();
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

  const getMealForSlot = (date: string, type: MealType) => {
    return mealPlans.find(mp => mp.date === date && mp.mealType === type);
  };

  const getRecipeTitle = (id: string) => {
    return recipes.find(r => r.id === id)?.title || 'Unknown Recipe';
  };

  return (
    <div className="meal-planner">
      <h2>Weekly Meal Planner</h2>
      {recipes.length === 0 && (
        <p className="hint alert">Add some recipes first to start planning your meals!</p>
      )}
      <div className="planner-grid">
        {days.map(date => (
          <div key={date} className="planner-day">
            <div className="day-header">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="day-meals">
              {mealTypes.map(type => {
                const meal = getMealForSlot(date, type);
                const slotId = `slot-${date}-${type}`;
                return (
                  <div key={slotId} className="meal-slot">
                    <label htmlFor={slotId}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                    {meal ? (
                      <div className="assigned-meal">
                        <span className="recipe-title">{getRecipeTitle(meal.recipeId)}</span>
                        <button 
                          className="remove-meal-btn" 
                          onClick={() => onRemoveMeal(meal.id)}
                          title={`Remove ${type} on ${date}`}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <select 
                        id={slotId}
                        value="" 
                        onChange={(e) => onAddMeal(date, type, e.target.value)}
                        className="recipe-select"
                        disabled={recipes.length === 0}
                      >
                        <option value="" disabled>Add recipe...</option>
                        {recipes.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
