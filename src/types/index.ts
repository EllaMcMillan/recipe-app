export interface Recipe {
  id: string;
  userId: string;
  title: string;
  sourceUrl?: string;
  ingredients: string[]; // Starting with simple array as per spec (array of strings or structured objects)
  instructions: string[];
  servings?: number | null;
  prepTime?: string;
  cookTime?: string;
  notes?: string;
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlan {
  id: string;
  userId: string;
  recipeId: string;
  date: string;
  mealType: MealType;
  servingsNeeded?: number;
}

export interface GroceryListItem {
  id: string;
  userId: string;
  weekStartDate: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  checked: boolean;
}
