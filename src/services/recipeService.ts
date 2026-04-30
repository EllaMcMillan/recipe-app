import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Recipe } from '../types';

const getRecipeCollection = (userId: string) => {
  return collection(db, 'users', userId, 'recipes');
};

export const subscribeToRecipes = (userId: string, callback: (recipes: Recipe[]) => void) => {
  const q = query(getRecipeCollection(userId), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const recipes = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Recipe));
    callback(recipes);
  }, (error) => {
    console.error("Error subscribing to recipes:", error);
  });
};

export const createRecipe = async (userId: string, recipe: Omit<Recipe, 'id' | 'userId'>) => {
  try {
    const recipeRef = doc(getRecipeCollection(userId));
    const newRecipe: Recipe = {
      ...recipe,
      id: recipeRef.id,
      userId,
      createdAt: recipe.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(recipeRef, newRecipe);
    return newRecipe;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (userId: string, recipeId: string, updates: Partial<Recipe>) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
    await updateDoc(recipeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (userId: string, recipeId: string) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
    await deleteDoc(recipeRef);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};
