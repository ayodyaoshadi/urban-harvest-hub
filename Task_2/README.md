# Task 2: Progressive Web Application with REST API and Database Integration (65 marks)

This folder contains the **Express REST API + MySQL** backend for Urban Harvest Hub. The **frontend (PWA)** is the React app in **Task 1/client**. Use Task 1’s client with `VITE_API_URL` pointing at this server.

---

## Task 2 Requirements Checklist

### PWA Functionality (frontend in Task 1/client)
- **Mobile-first responsive design** – Tailwind breakpoints, responsive layout (Task 1 client).
- **Service worker** – `Task 1/client/public/sw.js` caches and serves offline.
- **Installable** – `Task 1/client/public/manifest.json` (app name, icon, theme colours).
- **Push notifications** – `Task 1/client/public/sw.js` handles `push` events and shows notifications; `registerSW.js` exports `requestNotificationPermission()`. Call it from the app (e.g. on first visit or in settings) so users can receive updates (e.g. new events/products when you send push from a backend).

### Backend API + Database (this server)
- **REST API with Express** – This server (`Task 2/server`).
- **Database** – MySQL (same DB as Task 1: `urban_harvest_hub`). Set `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` (defaults: localhost, root, empty, urban_harvest_hub).
- **Endpoints** – Create, retrieve, update (and delete):
  - `GET/POST /api/workshops`, `GET/PUT/DELETE /api/workshops/:id`
  - `GET/POST /api/events`, `GET/PUT/DELETE /api/events/:id`
  - `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id`
  - `GET/POST /api/bookings`
- **Validation and error handling** – `express-validator` on POST/PUT; 400/404/500 JSON responses.

### Frontend Integration (Task 1 client)
- React SPA consumes this API via `backendApi` in `Task 1/client/src/services/api.js`.
- Set `VITE_API_URL=http://localhost:5000/api` (or your deployed API URL) so the client uses this server.
- Data shown with images, descriptions, categories; **search and filter** on Home (category, type, sort); **master–detail** (category → list → detail page).

### Mobile Device Capabilities (Task 1 client)
- **Light/dark mode** – Theme toggle (ThemeContext).
- **Geolocation** – WeatherWidget uses browser geolocation for local weather.
- **Offline access** – Service worker caches and serves pages/API responses when offline.
- **Notifications** – Request notification permission; SW shows notifications on push events.

### Deployment
- **API** – Deploy this server to Render, Railway, or similar (Node, start script `npm start`, MySQL connection env vars).
- **Frontend** – Deploy Task 1 client to Netlify, Vercel, or Firebase (build with `VITE_API_URL` set to the deployed API URL).
- **HTTPS** – Use the host’s default HTTPS (Render/Netlify provide it).

---

## Quick Start (local)

### 1. API (this server)

Ensure MySQL is running and the database `urban_harvest_hub` exists (same as Task 1; create it or run Task 1’s `backend/database/schema.sql` first). Optionally set env: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

```bash
cd Task 2/server
npm install
npm run init-db    # create tables (CREATE TABLE IF NOT EXISTS)
npm run seed       # optional: seed data
npm run dev        # http://localhost:5000
```

### 2. Frontend (Task 1 client)

```bash
cd Task 1/client
# Ensure .env has: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Open the client URL (e.g. http://localhost:5173). The app will use the Task 2 Express API for workshops, events, and products.

---

## API Response Format

- Success: `{ "success": true, "data": ... }` (optional `"message"`).
- Error: `{ "error": true, "message": "..." }` with status 400 (validation), 404 (not found), or 500 (server error).

This matches what Task 1 client expects (it uses `response.data` and checks `response.data?.data` or `response.data?.error`).

---

## Auth Note

This Task 2 server does **not** implement `/api/auth/login`, `/api/auth/register`, or `/api/auth/me`. The Task 1 client supports both the PHP backend (Task 1/backend) and this Express API. When using **only** this server, login/register/admin will not work; workshops, events, products, and bookings will. For full auth, use Task 1’s PHP backend or add auth routes to this server.
