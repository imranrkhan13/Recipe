
#  une recette: Mise en Place

**A professional-grade, aesthetic recipe organizer built for modern chefs.** RecipeBox combines high-end editorial design with functional utility. Featuring an interactive "Cooking Mode," smart ingredient searching, and a curated palette of "girly" and professional themes, it’s the ultimate digital sanctuary for your culinary creations.

---

## ✨ Key Features

* **⚡ Smart Search & Filter:** Instantly find recipes by title or specific ingredients (e.g., "onion"). Toggle between **Grid** and **List** views for better organization.
* **👩‍🍳 Interactive Cook Mode:** A dedicated, distraction-free interface with a built-in **Kitchen Timer** and step-by-step progress tracking.
* **🎨 Designer Themes:** Swap between 7+ custom-crafted themes including **Sakura Pink**, **Lavender**, and **Obsidian Gold**.
* **📱 PWA & Mobile-First:** Fully responsive with a custom Mobile FAB (Floating Action Button) and bottom-sheet drawers for a native app feel.
* **💾 Offline-Ready:** Powered by `localStorage` persistence and a robust toast notification system. No login required—your data stays on your device.

---

## 🎨 Theme Library

| Theme | Vibe | Primary Dot |
| --- | --- | --- |
| **Sakura** | pink, white, Floral | `#FDA4AF` |
| **Lavender** | Dreamy, Modern Violet | `#C084FC` |
| **Obsidian** | Dark, Luxury, Gold | `#C9A84C` |
| **Ivory** | Vintage, Clean, Classic | `#7A5C2E` |
| **Sage** | Earthy, Organic, Fresh | `#6BA878` |
| **Wine** | Moody, Elegant, Deep | `#C06060` |

---

## 🛠️ Technical Breakdown

* **Frontend:** React 18 (using `useReducer`, `useMemo`, and `useCallback` for performance).
* **Styling:** Atomic CSS Architecture with dynamic CSS Variable injection.
* **Typography:** Editorial-grade pairing of *Cormorant Garamond* (Serif) and *Outfit* (Sans-serif).
* **Icons:** Lucide-React for a consistent, minimal visual language.

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install

```

### 2. Launching

Start the development server:

```bash
npm start

```

---

## 📱 PWA Instructions

To use this as a full-screen app on your phone:

1. **Host the app** (e.g., via Vercel or Netlify).
2. **Open the link** in Safari (iOS) or Chrome (Android).
3. Tap **"Add to Home Screen"** in the share menu.
4. Launch **RecipeBox** from your home screen for a seamless, standalone experience.

---

## 💡 Pro Tips for Users

* **Comma Separation:** When adding ingredients, use commas (e.g., `onion, garlic, thyme`). This allows the search engine to accurately index each item.
* **Favorites:** Tap the **Heart** icon on any recipe card to pin your most-loved dishes to the top.
* **Cooking Timers:** In "Cook Mode," tap the timer icon to quickly set a countdown while your dish is in the oven.
