# My Cookbook App - Build Spec

## Overview

Build a web application for saving, organizing, planning, and shopping for recipes.

Core idea:
Users can save messy recipes from the internet, clean them up, organize them into categories, plan meals, and generate accurate grocery lists.

Important constraint:
The system must prioritize accuracy over automation. It must never guess or invent recipe data.

---

## Tech Stack

Frontend:

* React
* TypeScript
* Vite

Backend:

* Firebase Auth
* Firestore

Optional later:

* Cloud Functions (for parsing)
* AI-assisted parsing (only if controlled and non-hallucinating)

---

## Core Features (MVP)

### 1. Recipe Creation

Users can create recipes in three ways:

* Paste raw recipe text
* Manual entry
* paste link

Each recipe must include:

* title
* ingredients (array of strings or structured objects)
* instructions (array of steps)
* servings (number, optional)
* prepTime (optional)
* cookTime (optional)
* notes (optional)
* sourceUrl (optional)

---

### 2. Recipe Parsing (from pasted text)

When a user pastes recipe text:

* Attempt to extract:

  * ingredients
  * instructions
  * servings (if possible)

CRITICAL RULE:

* DO NOT guess missing data
* DO NOT invent ingredients, quantities, or steps

If parsing is incomplete:

* Prompt the user to fix only the missing parts

Example prompts:

* "Could not find ingredients. Please paste them."
* "Instructions are unclear. Please edit."
* "Serving size not detected. Add manually?"

The user must always be able to edit and confirm before saving.

---

### 3. Recipe Editing

Users must be able to:

* Edit all fields at any time
* Add/remove ingredients
* Add/remove steps
* Update servings, times, notes

---

### 4. Categories (Multi-Tag System)

Users can organize recipes using categories.

Requirements:

* Users can create categories
* Users can rename categories
* Users can delete categories

IMPORTANT:

* A recipe can belong to multiple categories
* This behaves like tags, not folders

Examples:

* "Dinner"
* "Cheap"
* "Easy"
* "Vegetarian"

Features:

* Add/remove recipe from categories
* Filter recipes by one or more categories
* Search within filtered results

---

### 5. Recipe List + Filtering

Users should be able to:

* View all recipes
* Search by title
* Filter by category
* Combine filters (multi-category filtering)

---

### 6. Meal Planner

Users can assign recipes to dates.

Requirements:

* Weekly view
* Each day supports:

  * breakfast
  * lunch
  * dinner

Features:

* Add recipe to a day
* Move meals between days
* Remove meals

---

### 7. Grocery List Generation

From the meal plan:

* Combine ingredients from all planned recipes
* Display as a list

Requirements:

* Group by category (basic grouping like produce, dairy, pantry)
* Allow manual editing
* Allow checking items off

IMPORTANT:

* Do not silently merge or alter ingredient quantities incorrectly
* If combining is unclear, keep items separate rather than guessing

---

## Data Model (Firestore)

### recipes

* id
* userId
* title
* sourceUrl
* ingredients (array)
* instructions (array)
* servings
* prepTime
* cookTime
* notes
* categoryIds (array)
* createdAt
* updatedAt

### categories

* id
* userId
* name
* createdAt

### mealPlans

* id
* userId
* recipeId
* date
* mealType (breakfast | lunch | dinner)
* servingsNeeded (optional)

### groceryListItems

* id
* userId
* weekStartDate
* name
* quantity
* unit
* category
* checked (boolean)

---

## UX Rules (VERY IMPORTANT)

1. Never guess missing recipe data
2. Always ask the user when something is unclear
3. Prefer incomplete but correct over complete but wrong
4. Allow users to fix things quickly without starting over
5. Keep UI simple and clean

---

## Development Order

1. Set up React + Firebase
2. Implement recipe creation + storage
3. Implement parsing with manual correction flow
4. Implement categories (multi-tag system)
5. Implement recipe list + filtering
6. Implement meal planner
7. Implement grocery list generation

---

## Non-Goals (for now)

* Perfect recipe parsing
* AI-generated recipes
* Social features
* Sharing between users

---

## Goal

Build a working, simple version that:

* reliably stores recipes
* lets users organize them flexibly
* supports weekly meal planning
* generates usable grocery lists

Accuracy and usability are more important than automation.
