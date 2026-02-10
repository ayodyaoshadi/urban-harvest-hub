# Task 2: Are All Requirements in the Code?

This checklist maps every Task 2 requirement (PWA, Backend API + Database, Frontend Integration, Mobile Capabilities, Deployment) and the marking criteria to the codebase. ✅ = present in code; ⚠️ = you must do (deploy, run Lighthouse).

---

## PWA Functionality

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| Mobile-first responsive design | ✅ | Task_1/client: Tailwind breakpoints (`md:`, `lg:`), mobile-first layout; Navbar and grids responsive. |
| Service worker for caching and offline functionality | ✅ | `Task_1/client/public/sw.js` – install, activate, fetch (stale-while-revalidate for same-origin GET), offline fallback to cache and `/index.html`. |
| Installable with a manifest (app name, icon, theme colours) | ✅ | `Task_1/client/public/manifest.json` – name, short_name, description, start_url, display (standalone), theme_color, background_color, icons. |
| Push notifications for updates (e.g. events, new products) | ✅ | `sw.js`: `push` and `notificationclick` listeners. `Task_1/client/src/registerSW.js`: `requestNotificationPermission()` for user opt-in. |

---

## Backend API + Database

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| REST API built with Express | ✅ | `Task_2/server/src/index.js` – Express app, CORS, JSON body parser, routes mounted. |
| Database integration (MongoDB, MySQL, or SQLite) | ✅ | SQLite via `better-sqlite3` – `Task_2/server/src/db/database.js`; schema and data in `src/db/`. |
| Endpoints to create, retrieve, and update content (e.g. /items, /events) | ✅ | **Create:** POST `/api/workshops`, `/api/events`, `/api/products`, `/api/bookings`. **Retrieve:** GET (list and by id) for workshops, events, products, bookings. **Update:** PUT `/api/workshops/:id`, `/api/events/:id`, `/api/products/:id`. (Plus DELETE.) |
| Validation and error handling for POST/PUT requests | ✅ | `Task_2/server/src/middleware/validation.js` – express-validator for all POST/PUT; central error handler returns 400/404/500 with JSON `{ error, message }`. |

---

## Frontend Integration

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| React/Vue SPA consumes REST API data dynamically | ✅ | `Task_1/client/src/services/api.js` – `backendApi`, `backendServices.getWorkshops/getEvents/getProducts`; used in Home, Workshops, Events, Products, Admin, ApiDetail, BookingForm. |
| Data displayed with images, descriptions, and categories | ✅ | EcoCard and detail pages show image, title, description, category, price, availability; API data includes image_url, description, category. |
| At least one search and filter feature | ✅ | Home: filter by content category (food, lifestyle, education) and type (Workshop/Product/Event); sort by price, date, name. API routes support query params (category, search, upcoming). |
| Master–detail view (e.g. selecting an event shows its details) | ✅ | Home/list → click item → Detail or ApiDetail (`/workshop/:id`, `/event/:id`, `/product/:id`). Detail page shows full item and “Related items”. |

---

## Mobile Device Capabilities

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| At least two features (e.g. light/dark mode, geolocation, notifications, offline access) | ✅ | **Light/dark mode:** ThemeContext, Navbar toggle, `dark:` variants. **Geolocation:** `getUserLocation()` in api.js; WeatherWidget, NearbyEvents. **Push notifications:** sw.js push/notificationclick; requestNotificationPermission(). **Offline access:** Service worker caches and serves content when offline. (All four implemented.) |

---

## Deployment

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| Application deployed on a secure server (e.g. Firebase, Netlify, Render, Railway) | ⚠️ | `Task_2/DEPLOYMENT.md` describes how to deploy API (e.g. Render, Railway) and frontend (e.g. Netlify, Vercel). **You must actually deploy** and use HTTPS. |
| API and frontend integrated in the deployed version | ⚠️ | Set `VITE_API_URL` to the deployed API URL when building the frontend; docs in DEPLOYMENT.md. **You must deploy both** and point the client at the live API. |

---

## Marking Scheme (65 marks)

| Criteria | Marks | In code? | Evidence summary |
|----------|-------|----------|------------------|
| **PWA Implementation & Testing** | 15 | ✅ (code) / ⚠️ (you) | SW, manifest, caching (stale-while-revalidate), offline, installable, push. **You:** Run Lighthouse on deployed URL for PWA ≥90; deploy on HTTPS. |
| **API Development** | 15 | ✅ | Express; CRUD workshops, events, products; GET/POST bookings; validation (express-validator); error handling; RESTful; API.md. |
| **Database Integration** | 10 | ✅ | SQLite, schema (workshops, events, products, bookings), seed, parameterized queries, CRUD in routes. |
| **Frontend Integration** | 10 | ✅ | React SPA fetches from API; search/filter/sort on Home; master–detail (list → Detail/ApiDetail, Related items). |
| **Mobile Device Capabilities** | 5 | ✅ | Dark mode, geolocation, push notifications, offline access (all four). |
| **Application Design & Presentation** | 5 | ✅ | Content, responsive layout, media, Navbar; polish (loading/error states); DEVELOPMENT_PROCESS.md and checklists for explanation. |
| **Discretionary Marks** | 5 | ✅ | Multilingual (i18n); advanced caching (stale-while-revalidate); completeness (CRUD, PWA, API, DB, frontend); documentation. |
| **TOTAL** | **65** | | |

---

## Summary

- **In the code:** All Task 2 **functional** requirements are implemented: PWA (SW, manifest, caching, offline, push), Express REST API with CRUD and validation, SQLite database, frontend consuming the API with search/filter and master–detail, and at least two (in fact four) mobile features. The marking criteria are addressed in code.
- **Your actions:** (1) **Deploy** the API and frontend to a secure host with HTTPS (see `Task_2/DEPLOYMENT.md`). (2) **Run Lighthouse** on the deployed PWA URL and fix any issues until the PWA score is ≥ 90.

So **yes** – all of the Task 2 requirements and marking criteria are reflected in your code; deployment and Lighthouse testing are the only steps you need to do yourself.
