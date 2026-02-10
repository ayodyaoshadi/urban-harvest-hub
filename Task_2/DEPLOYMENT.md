# Task 2: Deployment (API + Frontend)

Deploy the **Express API** (Task 2/server) and the **React PWA** (Task 1/client) so they work together over HTTPS.

---

## 1. Deploy the API (Express + SQLite)

### Render (recommended)

1. Create a **Web Service**; connect your repo.
2. **Root directory**: `Task 2/server`
3. **Build**: `npm install`
4. **Start**: `npm start`
5. **Environment**: `NODE_ENV=production` (optional). For SQLite, the DB file is created in `data/`; on Render the filesystem is ephemeral unless you use a persistent disk. For a demo, ephemeral is fine (DB resets on deploy). For production, use Render Disk or an external DB (e.g. PostgreSQL add-on and switch the app to PG).
6. After deploy, note the URL, e.g. `https://your-api.onrender.com`

### Railway

1. New project → Deploy from GitHub; set **Root directory** to `Task 2/server`
2. Build: `npm install`; Start: `npm start`
3. Add a **Volume** for `data` if you want SQLite to persist.
4. Note the public URL, e.g. `https://your-app.railway.app`

### Other (Fly.io, etc.)

- Use Node 18+; run `npm install` and `npm start`. Expose PORT. For SQLite, attach a volume to `server/data` if you need persistence.

---

## 2. Deploy the Frontend (Task 1 client)

### Netlify

1. Connect repo; **Base directory**: `Task 1/client`
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. **Environment variables**: `VITE_API_URL=https://your-api.onrender.com/api` (your deployed API URL + `/api`)
5. Deploy. Enable HTTPS (default on Netlify).

### Vercel

1. Import project; set **Root Directory** to `Task 1/client`
2. Build: `npm run build`; Output: `dist`
3. **Environment variable**: `VITE_API_URL=https://your-api.onrender.com/api`
4. Deploy. HTTPS is default.

### Firebase Hosting

1. In `Task 1/client`: `npm run build`
2. `firebase init hosting` → set `dist` as public directory
3. Add env at build time: `VITE_API_URL=https://your-api.onrender.com/api` then `npm run build`
4. `firebase deploy`

---

## 3. CORS

The Task 2 server uses `cors({ origin: true, credentials: true })`, so any origin is allowed. For production you can restrict:

```js
cors({ origin: 'https://your-frontend.netlify.app', credentials: true })
```

---

## 4. Checklist

- [ ] API deployed and returns 200 at `GET /api/health`
- [ ] Frontend deployed with `VITE_API_URL` set to the deployed API URL (including `/api`)
- [ ] Both served over HTTPS
- [ ] PWA: manifest and service worker work from the deployed frontend URL (installable, offline)
- [ ] Push: ensure notification permission and service worker push handler are tested on the deployed site
