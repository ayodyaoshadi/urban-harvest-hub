# How to Do the “Left Things”: Deploy + Lighthouse PWA ≥ 90

Two things are left: **deploy** (API + frontend on HTTPS) and **run Lighthouse** on the deployed PWA until the PWA score is ≥ 90.

---

## Part 1: Deploy the API (Task_2/server)

Use a free Node host. **Render** is a simple option.

### Option A: Render (free)

1. Go to [render.com](https://render.com) and sign up (GitHub login is easiest).
2. **New** → **Web Service**.
3. Connect your **GitHub** repo (the one that contains `Task_2/server`).
4. Settings:
   - **Name:** e.g. `urban-harvest-api`
   - **Root Directory:** `Task_2/server` (or `Task 2/server` if your repo uses a space).
   - **Runtime:** Node.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**. Wait for the first deploy.
6. Copy your API URL, e.g. `https://urban-harvest-api.onrender.com`.  
   Your API base for the frontend is this URL **+ `/api`**, e.g. `https://urban-harvest-api.onrender.com/api`.

**Test:** Open `https://your-api-url.onrender.com/api/health` in a browser. You should see JSON like `{"status":"online",...}`.

---

## Part 2: Deploy the Frontend (Task_1/client)

Use a free static host. **Netlify** is a simple option.

### Option A: Netlify (free)

1. Go to [netlify.com](https://netlify.com) and sign up (GitHub login is easiest).
2. **Add new site** → **Import an existing project** → choose **GitHub** and your repo.
3. Settings:
   - **Base directory:** `Task_1/client` (or `Task 1/client` if your repo uses a space).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables** → **Add variable**:
     - Key: `VITE_API_URL`  
     - Value: `https://your-api-url.onrender.com/api` (use the **exact** API URL from Part 1 + `/api`)
4. Click **Deploy**. Wait for the build to finish.
5. Your site will be at something like `https://random-name-12345.netlify.app`. You can change the name in **Site settings** → **Domain management**.

**Test:** Open your Netlify URL. The app should load and show “API online” in the navbar when the API is reachable.

---

## Part 3: Run Lighthouse and Get PWA ≥ 90

1. Open your **deployed frontend URL** in **Chrome** (HTTPS).  
   Use the real URL (e.g. Netlify), not localhost.
2. Open DevTools: **F12** or **Right‑click** → **Inspect**.
3. Go to the **Lighthouse** tab.
4. Select **Progressive Web App** (and optionally Performance, Accessibility).
5. Device: **Mobile** (recommended for PWA).
6. Click **Analyze page load** (or **Generate report**).
7. Check the **Progressive Web App** score:
   - If it is **≥ 90**: you’re done for this part.
   - If it is **&lt; 90**: Lighthouse will list “Opportunities” and “Diagnostics”. Fix those, redeploy if needed, and run Lighthouse again.

### Common PWA fixes if score is below 90

- **Installable:** Manifest must have `name`, `short_name`, `start_url`, `display`, and at least one icon (e.g. 192×192). Your `manifest.json` already has these; if the icon is small or SVG-only, add a 192×192 PNG icon and reference it in the manifest.
- **Service worker:** Your `sw.js` is already registered. Ensure the deployed site is served over **HTTPS** and that `/sw.js` returns 200.
- **Offline:** Your SW caches and serves offline. If “Responds with a 200 when offline” fails, check that the SW scope includes the page and that cache names/URLs match what you’re testing.
- **Viewport / meta:** Your app should have a viewport meta tag (Vite’s default `index.html` usually includes it).

After each change, redeploy the frontend and run Lighthouse again on the **deployed** URL until the PWA score is ≥ 90.

---

## Quick checklist

- [ ] API deployed (e.g. Render); `GET /api/health` returns 200 over HTTPS.
- [ ] Frontend deployed (e.g. Netlify) with `VITE_API_URL` set to `https://your-api-url/api`.
- [ ] Both use HTTPS.
- [ ] Lighthouse run on the **deployed** frontend URL; PWA score ≥ 90 (fix issues and re-run until you reach it).

That’s it. Once these are done, the “left things” for Task 2 are complete.
