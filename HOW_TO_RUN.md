# How to Run Urban Harvest Hub

Run **two things**: the REST API (Task 2 server) and the frontend (Task 1 client).

---

## Prerequisites

- **Node.js** 18 or newer
- **npm** (comes with Node)

---

## Step 1: Start the REST API (Task 2 server)

Open a terminal:

```bash
cd Task 2/server
npm install
npm run init-db
npm run seed
npm run dev
```

- API runs at **http://localhost:5000**
- `init-db` creates the SQLite database and tables
- `seed` adds sample workshops, events, and products
- Leave this terminal running

---

## Step 2: Start the frontend (Task 1 client)

Open a **second** terminal:

```bash
cd Task 1/client
npm install
npm run dev
```

- App runs at **http://localhost:5173** (or the port Vite shows)
- It already uses `VITE_API_URL=http://localhost:5000/api` (see `Task 1/client/.env`)

---

## Step 3: Use the app

1. In your browser go to **http://localhost:5173**
2. You can browse Home, Workshops, Events, Products, and use search/filter/sort
3. Bookings and API data use the Task 2 Express API
4. **Login/Register** use the PHP backend (Task 1/backend). If you only run Task 2 server, auth will not work; workshops, events, products, and bookings will still work

---

## One-time setup summary

| Step | Where | Command |
|------|--------|---------|
| 1 | `Task 2/server` | `npm install` then `npm run init-db` then `npm run seed` |
| 2 | `Task 1/client` | `npm install` |

## Every time you run

| Order | Where | Command | URL |
|-------|--------|--------|-----|
| 1 | `Task 2/server` | `npm run dev` | http://localhost:5000 |
| 2 | `Task 1/client` | `npm run dev` | http://localhost:5173 |

---

## Optional: Run frontend only (static content)

If you only want to see the UI without the Express API:

```bash
cd Task 1/client
npm install
npm run dev
```

- Home will use static data from `src/data/items.json`
- Workshops, Events, Products from the API will fail until the Task 2 server is running

---

## Optional: Production build

**API:**

```bash
cd Task 2/server
npm install
npm run init-db
npm run seed
npm start
```

**Frontend (build then serve):**

```bash
cd Task 1/client
npm install
npm run build
npm run preview
```

Or deploy the `dist/` folder and the server per `Task 2/DEPLOYMENT.md`.
