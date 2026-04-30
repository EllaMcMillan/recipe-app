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
import type { Category } from '../types';

const getCategoryCollection = (userId: string) => {
  return collection(db, 'users', userId, 'categories');
};

export const subscribeToCategories = (userId: string, callback: (categories: Category[]) => void) => {
  const q = query(getCategoryCollection(userId), orderBy('name', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Category));
    callback(categories);
  }, (error) => {
    console.error("Error subscribing to categories:", error);
  });
};

export const createCategory = async (userId: string, name: string) => {
  try {
    const categoryRef = doc(getCategoryCollection(userId));
    const newCategory: Category = {
      id: categoryRef.id,
      userId,
      name,
      createdAt: new Date().toISOString(),
    };
    await setDoc(categoryRef, newCategory);
    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (userId: string, categoryId: string, name: string) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
    await updateDoc(categoryRef, { name });
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  try {
    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
