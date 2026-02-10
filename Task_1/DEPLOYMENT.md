# Urban Harvest Hub – Deployment Guide

This guide covers production deployment of the frontend (SPA/PWA) and backend (REST API + database), with HTTPS, and testing for performance and accessibility.

## Prerequisites

- **Backend**: PHP 7.4+ with PDO MySQL, Apache (mod_rewrite) or Nginx
- **Database**: MySQL 5.7+ or MariaDB
- **Frontend**: Node.js 18+ for build

## 1. Database

1. Create database and user:
   ```sql
   CREATE DATABASE urban_harvest_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'uhh'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL ON urban_harvest_hub.* TO 'uhh'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Run schema and seed:
   ```bash
   mysql -u uhh -p urban_harvest_hub < backend/database/schema.sql
   mysql -u uhh -p urban_harvest_hub < backend/database/seed_data.sql
   ```

3. Update `backend/config/database.php` with your host, db name, user, and password.

## 2. Backend (REST API)

- Point your web server document root (or a vhost) to the `backend` folder so that `index.php` handles all requests (front-controller).
- Ensure `.htaccess` is enabled (Apache) or equivalent rewrite rules for Nginx:
  - All requests to `/api/*` (or your API base path) should be rewritten to `index.php`.
- Enable **HTTPS** (TLS) in production:
  - Use a certificate from Let’s Encrypt or your provider.
  - Redirect HTTP → HTTPS (301).
- Set **CORS** if frontend is on a different origin:
  - In `backend/index.php` and `.htaccess`, set `Access-Control-Allow-Origin` to your frontend origin (not `*` in production) and keep `Access-Control-Allow-Credentials: true` for session cookies.
- **Session**: Ensure `session_start()` is called (already in `index.php`) and that PHP session cookie is `SameSite=Lax` or `Strict` and `Secure` over HTTPS.

## 3. Frontend (SPA + PWA)

1. Set API base URL (must match your backend):
   ```bash
   # .env.production (or .env)
   VITE_API_URL=https://your-api-domain.com/urban-harvest-hub/backend
   ```
   Use the same origin as the frontend if you serve API under the same domain (e.g. `https://your-domain.com/api`).

2. Build:
   ```bash
   cd client
   npm ci
   npm run build
   ```

3. Deploy the contents of `client/dist` to your static host (e.g. Nginx, Apache, Netlify, Vercel):
   - Configure **SPA fallback**: all routes (e.g. `/workshops`, `/products`, `/admin`) should serve `index.html`.
   - Serve over **HTTPS** and set correct `Content-Security-Policy` if needed.

4. **PWA**:
   - `manifest.json` and `sw.js` are in `public/` and are copied to `dist/`; ensure they are served with correct MIME types and that the service worker scope is correct (usually `/`).
   - For **push notifications**, you need a backend push service (e.g. Web Push); the current `sw.js` handles `push` events for when you add that later.

## 4. Security Checklist

- HTTPS only in production.
- Restrict CORS to your frontend origin.
- Use strong DB passwords and never commit them.
- Keep PHP and Node dependencies updated.
- Admin routes (POST/PUT/DELETE on events, workshops, products) require session auth and `role = admin`; ensure login uses secure cookies.

## 5. Performance & Accessibility Testing (Mobile)

- **Lighthouse** (Chrome DevTools): run Performance and Accessibility audits on a mobile device profile (or throttled) to check:
  - Performance score, LCP, CLS.
  - ARIA usage, contrast, focus order, skip link.
- **Responsive design**: test breakpoints (e.g. 320px, 375px, 414px) and touch targets (min 44px).
- **PWA**: In Lighthouse, verify “Progressive Web App” (installable, offline, manifest, service worker).
- **Multilingual**: Switch EN/ES and confirm labels and content update; check `lang` attribute on `<html>` (can be set from i18n on app init).

## 6. Quick Local Test (PHP built-in server)

Backend (from project root):
```bash
cd backend
php -S localhost:8080
```
API base: `http://localhost:8080`

Frontend:
```bash
cd client
# API base must include /api (backend routes: /api/workshops, /api/events, etc.)
echo "VITE_API_URL=http://localhost:8080/api" > .env
npm run dev
```
Then open the dev server URL. If frontend is on a different port (e.g. 5173), ensure backend CORS allows that origin.
