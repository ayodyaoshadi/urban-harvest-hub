# Deploy Urban Harvest Hub from Scratch (Step-by-Step)

This guide gets the **React PWA** (Task 1) and **Express API + MySQL** (Task 2) online using free tiers: **GitHub**, **PlanetScale** (MySQL), **Render** (API), and **Vercel** (frontend).

---

## What you’ll need

- A **GitHub** account  
- A **Render** account (render.com)  
- A **Vercel** account (vercel.com)  
- A **PlanetScale** account (planetscale.com) — for free MySQL  

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

## Step 2: Create a MySQL database (PlanetScale)

Your API needs a MySQL database. PlanetScale’s free tier works with your existing code.

### 2.1 Sign up and create a database

1. Go to [planetscale.com](https://planetscale.com) and sign up (GitHub login is fine).  
2. Click **Create a database**.  
3. **Name:** e.g. `urban-harvest-hub`.  
4. **Region:** pick one near you (or near Render’s region).  
5. **Plan:** Free.  
6. Click **Create database**.

### 2.2 Get connection details

1. Open your new database.  
2. Click **Connect** (or **Connect with**).  
3. Choose **Connect with: General** (or **MySQL**).  
4. Copy or note:
   - **Host**  
   - **Username**  
   - **Password** (click “Show” and copy; you may only see it once).  
   - **Database name** (often same as the DB name you chose).

You’ll use these in Step 4 for the API.

### 2.3 Run the schema and seed (one-time)

1. In PlanetScale, open the **Console** tab (or **Branches** → your branch → **Console**).  
2. Copy the contents of **`Task_2/server/src/db/schema-mysql.sql`** from your project and run it in the Console (run each `CREATE TABLE` statement if needed).  
3. To add sample data, you can either:
   - Run the INSERTs from your seed logic manually in the Console, or  
   - After the API is deployed (Step 4), run the seed script **once** from your PC with env vars pointing to PlanetScale (see Step 4.4).

---

## Step 3: Deploy the API on Render

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

- **Render free tier sleeps**  
  The first request after idle can be slow; that’s normal. Lighthouse may need a warm request before running.
