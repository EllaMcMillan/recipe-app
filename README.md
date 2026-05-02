# My Cookbook App 🍳

A modern, functional recipe manager designed for accuracy and simplicity. Save messy recipes from the web, organize them with ease, plan your weekly meals, and generate organized grocery lists.

Built with a "No-Guessing" philosophy—prioritizing accurate data entry over unpredictable automation.

---

## ✨ Features

### 📖 Recipe Management
- **Smart Parsing**: Paste raw text from any source. The custom parser identifies titles, ingredients, instructions, servings, and cook times without "guessing" or inventing data.
- **Categorization**: Multi-tag system to organize recipes (e.g., "Dinner," "Easy," "Vegan"). Filter and search within specific categories.
- **Recipe Detail View**: Clean, readable modal view for ingredients and steps.
- **Full CRUD**: Create, edit, and delete recipes, with automatic cleanup of associated meal plans.

### 📥 Submission Inbox
- **Google Form Integration**: Friends and family can submit recipes via a simple Google Form.
- **Inbox Review**: New submissions appear in a dedicated "Inbox" tab. Review the raw text, use the auto-parser, and save them to your personal collection with one click.

### 📅 Meal Planning & Shopping
- **Weekly Planner**: Assign recipes to breakfast, lunch, or dinner slots across the week.
- **Smart Grocery List**: Automatically aggregates ingredients from your meal plan into a checklist.
- **Manual Items**: Add extra household items to your shopping list as needed.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Vanilla CSS (Custom "Cookbook" theme)
- **Parsing**: Custom Regex-based heuristic parser

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase project

### 2. Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the App
```bash
npm run dev
```

---

## 🔥 Firebase Setup Notes

### Firestore Structure
- `users/{uid}/recipes`: Personal recipe collection.
- `users/{uid}/categories`: Custom tags/categories.
- `users/{uid}/mealPlans`: Scheduled meals.
- `recipeSubmissions`: Top-level collection for incoming external submissions (status: "new" | "reviewed").

### Security Rules (Recommended)
Ensure users can only read/write their own data in the `users` subcollection, while the `recipeSubmissions` collection allows creation from external sources (e.g., Apps Script) and read/update access for authenticated users.

---

## 📝 Google Form Flow

This app supports external submissions through a unique flow:
1. **Google Form**: A form collects `name`, `recipeName`, and `rawText`.
2. **Apps Script**: On form submission, an Apps Script pushes the data to the `recipeSubmissions` Firestore collection with `status: "new"`.
3. **App Inbox**: You receive a notification in the app, can review the raw text, and use the built-in parser to import it into your collection.

---

## ⚠️ Current Limitations
- **Manual Parsing**: The parser is heuristic-based and may require manual tweaks for non-standard formats.
- **Image Support**: Currently text-only (images are planned for a future update).
- **Single-Account Focus**: Designed primarily for individual usage.

---

## 🗺️ Roadmap
- [ ] **Image Uploads**: Attach photos to recipes.
- [ ] **OCR Integration**: Use Google Vision to scan physical cookbook pages.
- [ ] **Unit Conversion**: Toggle between Metric and Imperial measurements.
- [ ] **Recipe Export**: Export recipes as clean, printable PDFs.
- [ ] **Social Sharing**: Share specific recipes or meal plans via a unique link.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
