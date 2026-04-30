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
import type { GroceryListItem } from '../types';

const getShoppingListCollection = (userId: string) => {
  return collection(db, 'users', userId, 'shoppingListItems');
};

export const subscribeToShoppingListItems = (userId: string, callback: (items: GroceryListItem[]) => void) => {
  const q = query(getShoppingListCollection(userId), orderBy('name', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as GroceryListItem));
    callback(items);
  }, (error) => {
    console.error("Error subscribing to shopping list:", error);
  });
};

export const createShoppingListItem = async (userId: string, name: string) => {
  try {
    const itemRef = doc(getShoppingListCollection(userId));
    const newItem: GroceryListItem = {
      id: itemRef.id,
      userId,
      name,
      weekStartDate: new Date().toISOString().split('T')[0],
      checked: false,
    };
    await setDoc(itemRef, newItem);
    return newItem;
  } catch (error) {
    console.error("Error creating shopping item:", error);
    throw error;
  }
};

export const updateShoppingListItem = async (userId: string, itemId: string, updates: Partial<GroceryListItem>) => {
  try {
    const itemRef = doc(db, 'users', userId, 'shoppingListItems', itemId);
    await updateDoc(itemRef, updates);
  } catch (error) {
    console.error("Error updating shopping item:", error);
    throw error;
  }
};

export const deleteShoppingListItem = async (userId: string, itemId: string) => {
  try {
    const itemRef = doc(db, 'users', userId, 'shoppingListItems', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting shopping item:", error);
    throw error;
  }
};
