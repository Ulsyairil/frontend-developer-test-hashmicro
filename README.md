# HashMicro Frontend Vue Test (No Build Step)

A simple CRUD app that runs directly in the browser (no bundler / no build). It uses **Vue 3 (CDN)** + **Pinia (CDN)** for state management, **Materialize CSS** for UI, **jQuery** for small enhancements, and **IndexedDB** for persistence.

## Tech Stack
- Vue 3 (global build via CDN)
- Pinia (via CDN)
- Materialize CSS + Material Icons
- jQuery (minor UI behaviors)
- IndexedDB (CRUD storage)

## Features
- Records CRUD: **list, create, view, edit, delete**
- Client-side routing (History API; Hash fallback for `file://`)
- Search + sorting + simple KPIs in store
- Data persists across refresh (IndexedDB). Seed data is created if DB is empty.
- “Dense table” preference saved to `localStorage`

## Project Structure (key files)
- `index.html` — App shell + CDN dependencies + script loading order
- `assets/js/app.js` — Vue app bootstrap + route/view selection
- `assets/js/router.js` — Minimal router parser (supports History + Hash fallback)
- `assets/js/store.js` — Pinia store (records, filters, sorting, actions)
- `assets/js/db.js` — IndexedDB helpers + seeding
- `assets/js/jquery-enhancements.js` — Materialize init + small UI interactions

## Running Locally

### Option A — Recommended: Local server (best for History routing)
Use any static server and open the URL it provides.
Examples:
- VS Code extension “Live Server”
- `python -m http.server 5173`
- `npx serve`

Then open:
- `/` (Records list)
- `/create`
- `/about`
- `/view/:id`
- `/edit/:id`

Routing uses the History API when served over `http(s)`.

### Option B — Open directly (file://) using hash routing
If you open `index.html` directly in the browser, navigation falls back to hash-based routes:
- `#/`
- `#/create`
- `#/about`
- `#/view/1`
- `#/edit/1`

## Data Persistence / Reset
- Records are stored in **IndexedDB** under a dedicated database and object store.
- To reset the app, clear site data in your browser (IndexedDB + localStorage).

## Notes
- This project intentionally uses CDN scripts and a simple in-browser architecture (no Vite/Webpack).
- UI styling relies on Materialize; small UX behaviors are handled via jQuery and Materialize JS.
