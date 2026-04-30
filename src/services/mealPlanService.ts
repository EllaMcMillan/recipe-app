import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { MealPlan, MealType } from '../types';

const getMealPlanCollection = (userId: string) => {
  return collection(db, 'users', userId, 'mealPlans');
};

export const subscribeToMealPlans = (userId: string, callback: (mealPlans: MealPlan[]) => void) => {
  const q = query(getMealPlanCollection(userId), orderBy('date', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const mealPlans = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as MealPlan));
    callback(mealPlans);
  }, (error) => {
    console.error("Error subscribing to meal plans:", error);
  });
};

export const createMealPlan = async (userId: string, date: string, mealType: MealType, recipeId: string) => {
  try {
    const mealPlanRef = doc(getMealPlanCollection(userId));
    const newMealPlan: MealPlan = {
      id: mealPlanRef.id,
      userId,
      date,
      mealType,
      recipeId,
    };
    await setDoc(mealPlanRef, newMealPlan);
    return newMealPlan;
  } catch (error) {
    console.error("Error creating meal plan:", error);
    throw error;
  }
};

export const deleteMealPlan = async (userId: string, mealPlanId: string) => {
  try {
    const mealPlanRef = doc(db, 'users', userId, 'mealPlans', mealPlanId);
    await deleteDoc(mealPlanRef);
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    throw error;
  }
};
