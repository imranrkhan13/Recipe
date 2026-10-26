
#  Une recette: Mise en Place

**A professional-grade, aesthetic recipe organizer built for modern chefs.** RecipeBox combines high-end editorial design with functional utility. Featuring an interactive "Cooking Mode," smart ingredient searching, and a curated palette of "girly" and professional themes, it’s the ultimate digital sanctuary for your culinary creations.

---

## ✨ Key Features

* **⚡ Smart Search & Filter:** Instantly find recipes by title or specific ingredients (e.g., "onion"). Toggle between **Grid** and **List** views for better organization.
* **👩‍🍳 Interactive Cook Mode:** A dedicated, distraction-free interface with a built-in **Kitchen Timer** and step-by-step progress tracking.
* **🎨 Designer Themes:** Swap between 7+ custom-crafted themes including **Sakura Pink**, **Lavender**, and **Obsidian Gold**.
* **📱 PWA & Mobile-First:** Fully responsive with a custom Mobile FAB (Floating Action Button) and bottom-sheet drawers for a native app feel.
* **Private Neon storage:** Sign in to your own collection. Old browser recipes remain available for explicit import. The installed PWA shows a reconnect screen offline; offline recipe editing is not supported.

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

* **Frontend:** React 19 (using `useReducer`, `useMemo`, and `useCallback` for performance).
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
npm run dev

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

## Private accounts + Neon database

This version uses a server-side PostgreSQL API. Each signed-in account can access only its own recipes. The database URL must never be a `VITE_` variable or committed to Git.

### Local setup (Node 22 or newer)

1. `npm ci`
2. Copy `.env.example` to `.env` and set `DATABASE_URL` using your Neon connection string. Keep this file private.
3. `npm run db:migrate` applies only the additive `une_recette` schema in `db/001-init.sql`. It does not drop existing data. Review the target database before running it.
4. In one terminal run `npm run server`. In another run `npm run dev`.
5. Open Vite's local URL. Register a username and a password with at least 12 characters.

Production must use HTTPS. Passwords are salted and hashed with scrypt. Sessions use random, server-validated, HTTP-only, SameSite cookies. Account passwords are never stored as plaintext. There is no password recovery yet, so keep your credentials safe. Auth rate limits are per running process; apply shared/edge rate limits before wider public use. Expired sessions should be periodically deleted by a server maintenance job; they are rejected even before cleanup.

### Existing recipes

Old `mep-recipes2` browser data is not deleted or automatically uploaded. After sign-in, use **Copy into my account** only if these recipes belong to you. Browser originals remain untouched. Imported items use new IDs and successful copies are remembered on that browser to allow partial retries. Old temporary `blob:` photos cannot be transferred; remove or re-add those photos first. Import may copy earlier valid items before hitting an invalid item. It does not claim a full import if any item fails.

New photos must be PNG, JPG or WebP under 200 KB. They are stored with the recipe, not as temporary blob URLs. Recipe writes are version-checked, so an older device cannot silently overwrite a newer save. Refresh when a conflict is reported. Recipes are fetched into memory, not stored in a shared offline cache. Signing out unmounts and clears the collection from the UI. Your theme remains local to your browser.

### PWA and offline behavior

The app has a valid manifest, 192/512px PNG icons, and a service worker. Installability requires HTTPS (or localhost) and a browser that supports installation. Android browsers may offer Install; on iOS use Safari's Add to Home Screen. No native-device installation was verified as part of development.

The service worker caches only an offline landing page, manifest and icons. It never caches `/api/` responses or private recipes. Offline navigation shows a clear reconnect page. Offline editing and automatic sync are not implemented. If you lose connectivity with the app already open, saving fails visibly and the unsaved form is kept. Sign out requires a connection so the server can revoke the session.

### Deployment

No hosting migration is needed by the code. A Vercel-compatible handler is included under `api/`, alongside the existing Vite build. If using Vercel, set the server-only `DATABASE_URL` in the intended deployment environment before deployment; it is not bundled into frontend assets. Use Node 22 or newer. If using another host, run `npm run server` and route `/api/` to it while serving the frontend from the same HTTPS origin. Static-only hosting cannot run the database API by itself. Verify your current host before pushing to an auto-deploying branch.

### Tests

`npm test` runs validation tests and skips database integration tests unless `DATABASE_URL` is set. To include database tests: `node --env-file=.env --test tests/*.test.js`. Integration tests create two random synthetic accounts, exercise ownership, persistence, version conflicts, CSRF rejection and logout, then delete only those accounts. Use a development database for future tests. `npm run lint` and `npm run build` check the source and production bundle.
