import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './services/firebase'
import { createRecipe, updateRecipe } from './services/recipeService'
import { createCategory } from './services/categoryService'
import { createMealPlan, deleteMealPlan } from './services/mealPlanService'
import { createShoppingListItem, updateShoppingListItem, deleteShoppingListItem } from './services/shoppingListService'
import { useFirestoreData } from './hooks/useFirestoreData'
import './App.css'
import Auth from './features/auth/Auth'
import RecipeList from './features/recipes/RecipeList'
import RecipeForm from './features/recipes/RecipeForm'
import CategoryManager from './features/categories/CategoryManager'
import MealPlanner from './features/planner/MealPlanner'
import ShoppingList from './features/shopping-list/ShoppingList'
import type { Recipe, MealType } from './types'

type Tab = 'list' | 'create' | 'categories' | 'edit' | 'planner' | 'shopping'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('list')
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)

  // Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Live Firestore Data Hook
  const { recipes, categories, mealPlans, manualGroceryItems } = useFirestoreData(user)

  const handleLogout = () => signOut(auth)

  const handleSaveRecipe = async (recipeData: Recipe) => {
    if (!user) return
    try {
      if (editingRecipe) {
        const { id, userId, createdAt, updatedAt, ...updates } = recipeData
        await updateRecipe(user.uid, id, updates)
        setEditingRecipe(null)
      } else {
        const { id, userId, createdAt, updatedAt, ...newData } = recipeData
        await createRecipe(user.uid, newData as any) 
      }
      setActiveTab('list')
    } catch (error) {
      console.error("Error saving recipe:", error)
      alert("Failed to save recipe. Please check your connection.")
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
    setActiveTab('edit')
  }

  const handleCancelForm = () => {
    setEditingRecipe(null)
    setActiveTab('list')
  }

  const handleAddCategory = async (name: string) => {
    if (!user) return
    try {
      await createCategory(user.uid, name)
    } catch (error) {
      console.error("Error adding category:", error)
      alert("Failed to add category.")
    }
  }

  const handleAddMeal = async (date: string, type: MealType, recipeId: string) => {
    if (!user) return
    try {
      await createMealPlan(user.uid, date, type, recipeId)
    } catch (error) {
      console.error("Error adding meal:", error)
      alert("Failed to assign meal.")
    }
  }

  const handleRemoveMeal = async (mealPlanId: string) => {
    if (!user) return
    try {
      await deleteMealPlan(user.uid, mealPlanId)
    } catch (error) {
      console.error("Error removing meal:", error)
    }
  }

  const handleAddGroceryItem = async (name: string) => {
    if (!user) return
    try {
      await createShoppingListItem(user.uid, name)
    } catch (error) {
      console.error("Error adding grocery item:", error)
      alert("Failed to add item.")
    }
  }

  const handleToggleGroceryItem = async (id: string) => {
    if (!user) return
    const item = manualGroceryItems.find(i => i.id === id)
    if (item) {
      try {
        await updateShoppingListItem(user.uid, id, { checked: !item.checked })
      } catch (error) {
        console.error("Error toggling item:", error)
      }
    }
  }

  const handleDeleteGroceryItem = async (id: string) => {
    if (!user) return
    try {
      await deleteShoppingListItem(user.uid, id)
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  if (loading) {
    return <div className="loading" aria-live="polite">Loading My Cookbook...</div>
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>My Cookbook</h1>
          <div className="user-info">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <nav aria-label="Main Navigation">
          <button 
            className={activeTab === 'list' ? 'active' : ''} 
            onClick={() => setActiveTab('list')}
          >
            Recipes
          </button>
          <button 
            className={activeTab === 'create' ? 'active' : ''} 
            onClick={() => setActiveTab('create')}
          >
            Add
          </button>
          <button 
            className={activeTab === 'planner' ? 'active' : ''} 
            onClick={() => setActiveTab('planner')}
          >
            Plan
          </button>
          <button 
            className={activeTab === 'shopping' ? 'active' : ''} 
            onClick={() => setActiveTab('shopping')}
          >
            Shop
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => setActiveTab('categories')}
          >
            Tags
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'list' && (
          <RecipeList 
            recipes={recipes} 
            categories={categories} 
            onEdit={handleEditRecipe} 
          />
        )}
        {(activeTab === 'create' || activeTab === 'edit') && (
          <RecipeForm 
            categories={categories} 
            initialRecipe={editingRecipe || undefined}
            onSave={handleSaveRecipe} 
            onCancel={handleCancelForm} 
          />
        )}
        {activeTab === 'categories' && (
          <CategoryManager 
            categories={categories} 
            onAddCategory={handleAddCategory} 
          />
        )}
        {activeTab === 'planner' && (
          <MealPlanner 
            recipes={recipes} 
            mealPlans={mealPlans} 
            onAddMeal={handleAddMeal} 
            onRemoveMeal={handleRemoveMeal} 
          />
        )}
        {activeTab === 'shopping' && (
          <ShoppingList 
            recipes={recipes} 
            mealPlans={mealPlans} 
            manualItems={manualGroceryItems}
            onToggleItem={handleToggleGroceryItem}
            onAddItem={handleAddGroceryItem}
            onDeleteItem={handleDeleteGroceryItem}
          />
        )}
      </main>
    </div>
  )
}

export default App
