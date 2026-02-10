# Step 1: Push Your Code to GitHub (Then Deploy on Render)

You need your project on GitHub so Render can deploy from it. Do this first.

---

## Part A: Push This Project to GitHub

### 1. Create a new repository on GitHub

1. Go to [github.com](https://github.com) and make sure you’re logged in.
2. Click the **+** (top right) → **New repository**.
3. **Repository name:** e.g. `urban-harvest-hub`.
4. Choose **Public**.
5. **Do not** check “Add a README” (you already have code).
6. Click **Create repository**.

### 2. Push your local code to that repo

Open a terminal in your project folder (the one that contains `Task_1`, `Task_2`, etc.) and run:

```bash
# If you've never used git in this folder, init and add remote:
git init
git add .
git commit -m "Initial commit: Urban Harvest Hub Task 1 and Task 2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username (e.g. if your profile is `github.com/john`, use `john`).

If the folder is already a git repo (you see a `.git` folder), use:

```bash
git add .
git commit -m "Add Urban Harvest Hub for deployment"
git remote add origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git
git branch -M main
git push -u origin main
```

If it says the remote already exists, use:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/urban-harvest-hub.git
git push -u origin main
```

After this, your code should appear on GitHub in the repo you created.

---

## Part B: On Render – Create a Web Service (API)

1. In Render, click **+ New** (top right) → **Web Service**.
2. **Connect a repository:**  
   If you don’t see your repo, click **Configure account** and allow Render to access your GitHub (or the org that owns the repo).  
   Then select the repo you just pushed (e.g. `urban-harvest-hub`).
3. Click **Connect**.
4. Settings:
   - **Name:** e.g. `urban-harvest-api`
   - **Region:** choose one close to you
   - **Root Directory:** click **Set** and type: `Task_2/server`  
     (or `Task 2/server` if your repo has a space in the folder name)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Create Web Service**. Render will build and deploy.
6. When it’s live, copy the URL (e.g. `https://urban-harvest-api.onrender.com`).  
   Your API base URL for the frontend is: **that URL + `/api`**  
   Example: `https://urban-harvest-api.onrender.com/api`

---

## Part C: Deploy Frontend (e.g. Netlify)

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub.
2. **Add new site** → **Import an existing project** → **GitHub** → choose the same repo (`urban-harvest-hub`).
3. Settings:
   - **Base directory:** `Task_1/client` (or `Task 1/client`)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables** → **Add** → Key: `VITE_API_URL`, Value: `https://urban-harvest-api.onrender.com/api` (your Render URL + `/api`)
4. **Deploy**. Your app will be at a URL like `https://something.netlify.app`.

---

## Summary

1. Create a new repo on GitHub (no README).
2. In your project folder: `git init` (if needed), `git add .`, `git commit`, `git remote add origin <repo-url>`, `git push -u origin main`.
3. On Render: **+ New** → **Web Service** → connect the repo → Root directory `Task_2/server` → Build `npm install`, Start `npm start` → Create.
4. On Netlify: Import the same repo → Base `Task_1/client`, build, set `VITE_API_URL` to your Render URL + `/api` → Deploy.

After that, run Lighthouse on your Netlify URL to get PWA ≥ 90.
