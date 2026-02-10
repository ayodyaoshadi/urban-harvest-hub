# Urban Harvest Hub

A full-stack eco-conscious community platform: **SPA** (desktop) and **PWA** (mobile) with workshops, events, sustainable products, bookings, reviews, and product subscriptions.

## Features

- **Content**: Workshops, local events, sustainable products (REST API + MySQL).
- **Frontend**: Single-page app (React + Vite) and Progressive Web App (offline, installable, push-ready).
- **Roles**: Community members (view, book, subscribe, review); admins (CRUD events, workshops, products).
- **External APIs**: Weather (Open-Meteo), maps (OpenStreetMap/Nominatim).
- **Accessibility**: Skip link, ARIA, responsive layout.
- **i18n**: English and Spanish.

## Stack

- **Backend**: PHP 7.4+, MySQL, Apache/Nginx.
- **Frontend**: React 19, Vite 7, Tailwind CSS, react-i18next.
- **PWA**: `manifest.json`, service worker (`public/sw.js`), update notifications.

## Quick Start

1. **Database**: Create DB, then run `backend/database/schema.sql` and `backend/database/seed_data.sql`. Update `backend/config/database.php`.
2. **Backend**: Point web server at `backend/` (or run `php -S localhost:8080` from `backend/`).
3. **Frontend**: In `client/`, set `VITE_API_URL` (e.g. `http://localhost:8080/api`), then `npm install` and `npm run dev`.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for production deployment, HTTPS, and performance/accessibility testing.

## Default Users (seed)

- Admin: `admin@urbanharvest.com` / `password123`
- Member: `john@example.com` / `password123`

## API Base URL

Set `VITE_API_URL` so the frontend can reach the API (e.g. `https://your-domain.com/api`). Backend routes: `/api/workshops`, `/api/events`, `/api/products`, `/api/bookings`, `/api/reviews`, `/api/subscriptions`, `/api/auth/login`, `/api/auth/register`, `/api/auth/me`.
