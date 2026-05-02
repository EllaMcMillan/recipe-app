import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './services/firebase'
import { createRecipe, updateRecipe, deleteRecipe } from './services/recipeService'
import { createCategory } from './services/categoryService'
import { createMealPlan, deleteMealPlan } from './services/mealPlanService'
import { createShoppingListItem, updateShoppingListItem, deleteShoppingListItem } from './services/shoppingListService'
import { updateSubmissionStatus } from './services/submissionService'
import { useFirestoreData } from './hooks/useFirestoreData'
import './App.css'
import Auth from './features/auth/Auth'
import RecipeList from './features/recipes/RecipeList'
import RecipeForm from './features/recipes/RecipeForm'
import Inbox from './features/recipes/Inbox'
import CategoryManager from './features/categories/CategoryManager'
import MealPlanner from './features/planner/MealPlanner'
import ShoppingList from './features/shopping-list/ShoppingList'
import SubmissionInfo from './components/common/SubmissionInfo'
import type { Recipe, MealType, RecipeSubmission } from './types'

type Tab = 'list' | 'create' | 'categories' | 'edit' | 'planner' | 'shopping' | 'inbox' | 'invite'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('list')
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [preloadedRawText, setPreloadedRawText] = useState<string | null>(null)
  const [preloadedTitle, setPreloadedTitle] = useState<string | null>(null)
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null)

  // Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Live Firestore Data Hook
  const { recipes, categories, mealPlans, manualGroceryItems, submissions } = useFirestoreData(user)

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
        
        // If this came from a submission, mark it as reviewed
        if (activeSubmissionId) {
          await updateSubmissionStatus(activeSubmissionId, 'reviewed')
          setActiveSubmissionId(null)
          setPreloadedRawText(null)
          setPreloadedTitle(null)
        }
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

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!user) return
    try {
      // 1. Delete associated meal plans
      const associatedMealPlans = mealPlans.filter(mp => mp.recipeId === recipeId)
      for (const mp of associatedMealPlans) {
        await deleteMealPlan(user.uid, mp.id)
      }
      
      // 2. Delete the recipe
      await deleteRecipe(user.uid, recipeId)
    } catch (error) {
      console.error("Error deleting recipe:", error)
      alert("Failed to delete recipe.")
    }
  }

  const handleCancelForm = () => {
    setEditingRecipe(null)
    setPreloadedRawText(null)
    setPreloadedTitle(null)
    setActiveSubmissionId(null)
    setActiveTab('list')
  }

  const handleReviewSubmission = (submission: RecipeSubmission) => {
    // Prepend title to raw text to help parser identify it
    const enhancedRawText = `${submission.recipeName}\n\n${submission.rawText}`
    setPreloadedRawText(enhancedRawText)
    setPreloadedTitle(submission.recipeName)
    setActiveSubmissionId(submission.id)
    setEditingRecipe(null)
    setActiveTab('create')
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
            className={activeTab === 'inbox' ? 'active' : ''} 
            onClick={() => setActiveTab('inbox')}
          >
            Inbox {submissions.length > 0 && <span className="tab-badge">{submissions.length}</span>}
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
          <button 
            className={activeTab === 'invite' ? 'active' : ''} 
            onClick={() => setActiveTab('invite')}
          >
            Invite
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'list' && (
          <RecipeList 
            recipes={recipes} 
            categories={categories} 
            onEdit={handleEditRecipe} 
            onDelete={handleDeleteRecipe}
          />
        )}
        {activeTab === 'inbox' && (
          <Inbox 
            submissions={submissions}
            onReview={handleReviewSubmission}
          />
        )}
        {(activeTab === 'create' || activeTab === 'edit') && (
          <RecipeForm 
            categories={categories} 
            initialRecipe={editingRecipe || undefined}
            initialPasteText={preloadedRawText || undefined}
            initialTitle={preloadedTitle || undefined}
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
        {activeTab === 'invite' && (
          <SubmissionInfo />
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
