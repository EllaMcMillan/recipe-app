import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToRecipes } from '../services/recipeService';
import { subscribeToCategories } from '../services/categoryService';
import { subscribeToMealPlans } from '../services/mealPlanService';
import { subscribeToShoppingListItems } from '../services/shoppingListService';
import { subscribeToSubmissions } from '../services/submissionService';
import type { Recipe, Category, MealPlan, GroceryListItem, RecipeSubmission } from '../types';

export function useFirestoreData(user: User | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [manualGroceryItems, setManualGroceryItems] = useState<GroceryListItem[]>([]);
  const [submissions, setSubmissions] = useState<RecipeSubmission[]>([]);

  useEffect(() => {
    if (user) {
      const unsubRecipes = subscribeToRecipes(user.uid, setRecipes);
      const unsubCategories = subscribeToCategories(user.uid, setCategories);
      const unsubMealPlans = subscribeToMealPlans(user.uid, setMealPlans);
      const unsubShopping = subscribeToShoppingListItems(user.uid, setManualGroceryItems);
      const unsubSubmissions = subscribeToSubmissions(setSubmissions);

      return () => {
        unsubRecipes();
        unsubCategories();
        unsubMealPlans();
        unsubShopping();
        unsubSubmissions();
      };
    } else {
      setRecipes([]);
      setCategories([]);
      setMealPlans([]);
      setManualGroceryItems([]);
      setSubmissions([]);
    }
  }, [user]);

  return {
    recipes,
    categories,
    mealPlans,
    manualGroceryItems,
    submissions
  };
}
