# Deploy Urban Harvest Hub from Scratch (Step-by-Step)

This guide gets the **React PWA** (Task 1) and **Express API + MySQL** (Task 2) online. Options:

- **Free path:** GitHub + **Railway** (API + MySQL, free $5/month credit) + **Vercel** (frontend), or **Render** (API) + a free MySQL host (see Step 2).
- **Paid path:** **PlanetScale** (MySQL, from ~$15/mo) + **Render** (API) + **Vercel** (frontend).

---

## What you’ll need

- A **GitHub** account  
- **Vercel** (vercel.com) — frontend, free  
- For API + database, choose one:
  - **Railway** (railway.app) — free $5/month credit; run API + MySQL in one place (easiest free option), or  
  - **Render** (render.com) for API + a **free MySQL** host (e.g. db4free.net), or  
  - **PlanetScale** (planetscale.com) — paid MySQL from ~$15/mo  

---

## Step 1: Push your code to GitHub

### 1.1 Create a new repo on GitHub

1. Go to [github.com](https://github.com) and sign in.  
2. Click **+** (top right) → **New repository**.  
3. **Repository name:** e.g. `urban-harvest-hub`.  
4. Set visibility to **Public**.  
5. **Do not** add a README, .gitignore, or license (you already have code).  
6. Click **Create repository**.

### 1.2 Push your project from your PC

Open a terminal in the project root (the folder that contains `Task_1`, `Task_2`, etc.).

**If this folder is not yet a git repo:**

```bash
git init
git add .
git commit -m "Initial commit: Urban Harvest Hub PWA and API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git
git push -u origin main
```

**If it’s already a git repo:**

```bash
git add .
git status
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git
git branch -M main
git push -u origin main
```

Replace **YOUR_USERNAME** with your GitHub username.  
If `origin` already exists: `git remote set-url origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git` then `git push -u origin main`.

After this, your code should be on GitHub.

---

## Step 2: Create a MySQL database (free options)

Your API needs a MySQL database that’s reachable from the internet. **PlanetScale no longer has a free plan** (paid from ~$15/mo). Use one of these free options instead.

### Option A: Railway (API + MySQL together — recommended free path)

1. Go to [railway.app](https://railway.app) and sign in with GitHub.  
2. **New project** → **Deploy from GitHub** → select your `urban-harvest-hub` repo.  
3. Add a **MySQL** plugin: in the project, click **+ New** → **Database** → **MySQL**. Railway creates a MySQL instance and gives you env vars.  
4. Add your **API service**: **+ New** → **GitHub Repo** → same repo. Set **Root directory** to `Task_2/server`. Set **Start command** to `npm start`; build runs `npm install`.  
5. In the API service, go to **Variables** and add (Railway often injects `MYSQL_URL` or separate vars from the MySQL plugin — use those). If you get separate vars, add: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, and set `JWT_SECRET` to a long random string.  
6. Deploy. Open the API service → **Settings** → **Generate domain** to get a URL like `https://your-api.up.railway.app`. Your API base for the frontend is that URL **+ `/api`**.  
7. Run schema + seed once: from your PC, set the same MySQL env vars (copy from Railway’s MySQL service variables) and run `cd Task_2/server` then `npm run seed` (and ensure schema runs — your app runs `initSchema()` on start, so tables may already exist; if not, run the SQL from `schema-mysql.sql` in Railway’s MySQL console or via a one-off command).  
8. **Skip Step 3 (Render)** and go to **Step 4 (Vercel)** using your Railway API URL.

### Option B: Free MySQL host (e.g. db4free.net) + Render for API

1. Sign up at [db4free.net](https://www.db4free.net) (or another free MySQL host). Create a database and user; note **host**, **username**, **password**, and **database name**.  
2. Run your schema: use the host’s phpMyAdmin or MySQL client to execute the contents of `Task_2/server/src/db/schema-mysql.sql`. Optionally run the seed script locally with these env vars to insert sample data.  
3. In **Step 3 (Render)**, when you add environment variables to the API, set `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. Do **not** set `MYSQL_SSL=true` unless the host requires SSL.  
4. Continue with Step 3 (Render) and Step 4 (Vercel) as in the guide.

### Option C: PlanetScale (paid)

If you prefer PlanetScale (paid from ~$15/mo): create a database, choose **Vitess** (MySQL-compatible) if offered, get connection details from **Connect**, set `MYSQL_SSL=true` in the API env vars, and run the schema in PlanetScale’s console. Then follow Step 3 (Render) and Step 4 (Vercel).

---

## Step 3: Deploy the API on Render

**If you used Railway (Step 2 Option A), you already have the API deployed — skip to Step 4** and use your Railway API URL as `VITE_API_URL`.

### 3.1 Create a Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in (e.g. with GitHub).  
2. Click **New +** → **Web Service**.  
3. Connect your GitHub account if asked, then select the repo **urban-harvest-hub**.  
4. Click **Connect**.

### 3.2 Configure the service

Set:

| Field | Value |
|-------|--------|
| **Name** | `urban-harvest-api` (or any name) |
| **Region** | Choose one close to you |
| **Root Directory** | `Task_2/server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 3.3 Environment variables

Click **Environment** (or **Environment Variables**) and add:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MYSQL_HOST` | *(PlanetScale Host from Step 2.2)* |
| `MYSQL_USER` | *(PlanetScale Username)* |
| `MYSQL_PASSWORD` | *(PlanetScale Password)* |
| `MYSQL_DATABASE` | *(PlanetScale Database name)* |
| `MYSQL_SSL` | `true` |
| `JWT_SECRET` | A long random string (e.g. generate one at randomkeygen.com) |

Save. Then click **Create Web Service**. Render will build and deploy.

### 3.4 Get your API URL

When the deploy finishes, open the service and copy the URL, e.g.:

`https://urban-harvest-api.onrender.com`

Your **API base URL** for the frontend is this URL **+ `/api`**:

`https://urban-harvest-api.onrender.com/api`

### 3.5 (Optional) Run seed from your PC

If you didn’t run the seed in PlanetScale Console, run it once with the same env vars:

```bash
cd Task_2/server
set MYSQL_HOST=your-planetscale-host
set MYSQL_USER=your-username
set MYSQL_PASSWORD=your-password
set MYSQL_DATABASE=urban_harvest_hub
set MYSQL_SSL=true
npm run seed
```

On macOS/Linux use `export` instead of `set`. Use the exact values from PlanetScale.

### 3.6 Check the API

Open in a browser or Postman:

`https://urban-harvest-api.onrender.com/api/health`

You should see something like `{"status":"online",...}`.

---

## Step 4: Deploy the frontend (PWA) on Vercel

### 4.1 Import the project

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).  
2. Click **Add New…** → **Project**.  
3. Import the **urban-harvest-hub** repo.  
4. If prompted, authorize Vercel to access the repo.

### 4.2 Configure the build

Set:

| Field | Value |
|-------|--------|
| **Root Directory** | Click **Edit** → set to `Task_1/client` |
| **Framework Preset** | Vite (or leave as auto) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 4.3 Environment variable for the API

Under **Environment Variables** add:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://urban-harvest-api.onrender.com/api` |

Use your **actual** Render API URL from Step 3.4 (including `/api`).

### 4.4 Deploy

Click **Deploy**. Wait for the build to finish.

Your PWA will be at a URL like:

`https://urban-harvest-hub-xxxx.vercel.app`

(or a custom domain if you add one).

---

## Step 5: Restrict CORS (recommended for production)

So only your frontend can call the API:

1. Open **Task_2/server/src/index.js** on your PC.  
2. Find the line that sets up CORS (e.g. `cors({ origin: true, ... })`).  
3. Change it to use your frontend URL, for example:

```js
cors({
  origin: 'https://urban-harvest-hub-xxxx.vercel.app',
  credentials: true,
})
```

Commit and push; Render will redeploy automatically.

---

## Step 6: Test and run Lighthouse

1. Open your **deployed** PWA URL (the Vercel URL) in Chrome.  
2. Test: login, workshops, events, products, booking, reviews, subscribe.  
3. Open DevTools (F12) → **Lighthouse** tab.  
4. Select **Performance**, **Accessibility**, **Best Practices**, **Progressive Web App**.  
5. Device: **Mobile** (or Desktop if required).  
6. Click **Analyze page load**.  
7. Use the report to fix any issues and improve scores.

---

## Quick reference

| Item | Where |
|------|--------|
| Repo | GitHub: `YOUR_USERNAME/urban-harvest-hub` |
| Database | PlanetScale: connection details in Connect |
| API | Render: `https://your-service.onrender.com` → base URL + `/api` |
| PWA | Vercel: `https://your-project.vercel.app` |
| API env vars | Render → your service → Environment |
| Frontend env var | Vercel → your project → Settings → Environment Variables |

---

## Troubleshooting

- **API returns 503 or doesn’t start**  
  Check Render logs. Ensure all `MYSQL_*` and `JWT_SECRET` are set and correct. For PlanetScale, `MYSQL_SSL=true` must be set.

- **Frontend can’t reach API**  
  Confirm `VITE_API_URL` is exactly the Render URL + `/api`, and that you redeployed the frontend after setting it. Check browser Network tab for failed requests.

- **CORS errors in browser**  
  Either keep `origin: true` for testing or set `origin` in Step 5 to your exact Vercel URL (no trailing slash).

- **Database empty (no workshops/events/products)**  
  Run the seed (Step 3.5) or run the INSERTs from the seed script in PlanetScale Console.

- **`Table 'railway.workshops' doesn't exist`**  
  The app creates tables on startup; if `workshops` is missing, create it manually.

  **Option A – Run from your PC (recommended if Railway’s Database tab is stuck “Attempting to connect…”):**  
  From `Task_2/server`, set the same `MYSQL_*` variables you use for Railway, then run:

  ```powershell
  $env:MYSQL_HOST="YOUR_RAILWAY_HOST"; $env:MYSQL_PORT="YOUR_PORT"; $env:MYSQL_USER="root"; $env:MYSQL_PASSWORD="YOUR_PASSWORD"; $env:MYSQL_DATABASE="railway"; node src/scripts/create-workshops-table.js
  ```

  Replace the placeholders with values from Railway → MySQL service → **Variables**. The script creates the `workshops` table and exits.

  **Option B – Railway UI or MySQL client:**  
  In **Railway** → MySQL service → **Database** tab (or any MySQL client with the same `MYSQL_*` vars), run:

  ```sql
  CREATE TABLE IF NOT EXISTS workshops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration_hours DECIMAL(4,2) DEFAULT 2.0,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    max_participants INT DEFAULT 20,
    current_participants INT DEFAULT 0,
    location VARCHAR(200),
    instructor_name VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

  Then run the seed (e.g. `npm run seed` in `Task_2/server` with the same env vars) so workshops (and events/products) get sample data.

- **Login returns 401 on the live (Vercel) site**  
  The live site uses **Railway’s** database. The user you created locally (e.g. in XAMPP) is not in Railway. Either **register** on the live site (Register → then Login), or add the same user to Railway by running from `Task_2/server` (with Railway `MYSQL_*` vars set):  
  `node src/scripts/seed-user-ayodya.js`  
  That creates user `ayodya` / password `ayodyapass` in Railway so you can log in on the live site.

- **Render free tier sleeps**  
  The first request after idle can be slow; that’s normal. Lighthouse may need a warm request before running.
