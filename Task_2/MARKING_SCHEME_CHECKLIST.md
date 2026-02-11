# Task 2 Marking Scheme Checklist (65 marks)

This checklist maps the implementation to the official marking criteria and **detailed marking ranges** for the PWA with REST API and Database Integration task.

---

## Detailed Marking Ranges (Rubric Bands)

### 1. PWA Implementation & Testing (max 15)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–4 | No service worker or manifest; PWA not installable; no offline features; not deployed |
| Satisfactory | 5–7 | Basic PWA (SW/manifest); limited caching or responsiveness; Lighthouse &lt;70; deployed but unstable |
| Good | 8–10 | Functional PWA with SW, manifest, basic offline caching; mobile-first; Lighthouse ≥75; deployed on secure hosting |
| Very Good | 11–13 | Strong PWA; advanced caching; fully responsive; installable with custom icons; Lighthouse ≥85 |
| **Excellent** | **14–15** | **Professional PWA; offline-first; installable; push notifications; optimized caching (e.g. stale-while-revalidate); Lighthouse ≥90; seamlessly deployed and tested** |

### 2. API Development (max 15)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–4 | API missing or non-functional; endpoints broken; no REST principles |
| Satisfactory | 5–7 | Basic endpoints (GET/POST) but incomplete; limited validation or error handling; poor REST |
| Good | 8–10 | Functional API with required endpoints (GET/POST); basic validation/error handling; some REST principles |
| Very Good | 11–13 | Full CRUD; strong validation and error handling; RESTful design |
| **Excellent** | **14–15** | **Professional-grade API; clean modular code; comprehensive validation; robust error handling; secure practices (e.g. auth, sanitization); well-documented; fully REST-compliant** |

### 3. Database Integration (max 10)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–3 | No database integration; data hard-coded or in JSON only |
| Satisfactory | 4 | Minimal database integration; limited storage/retrieval; errors or inefficiencies |
| Good | 5–6 | Functional DB connection (e.g. MongoDB/MySQL/SQLite); CRUD supported; basic schema |
| Very Good | 7–8 | Strong DB integration; efficient queries; robust schema; supports relationships (e.g. users ↔ bookings) |
| **Excellent** | **9–10** | **Professional DB integration; optimized queries, relationships, and indexing; validation at DB level; well-documented schema** |

### 4. Frontend Integration (max 10)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–3 | No frontend connection to API; hard-coded data |
| Satisfactory | 4 | Basic data fetch from API; limited display; errors in dynamic rendering |
| Good | 5–6 | SPA fetches and displays data correctly (GET/POST); one master–detail view |
| Very Good | 7–8 | Fully functional integration; search/filter and smooth master–detail; good error handling in UI |
| **Excellent** | **9–10** | **Professional frontend integration; clean UI; dynamic updates; search/filter/sort; robust error handling, loading states, and accessibility** |

### 5. Mobile Device Capabilities (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | No mobile features implemented |
| Satisfactory | 2 | One feature implemented (e.g. dark mode only) |
| Good | 3 | At least two mobile features implemented but with limited polish |
| Very Good | 4 | Two or more features implemented effectively (e.g. dark mode + geolocation). Smooth performance |
| **Excellent** | **5** | **Multiple mobile features integrated seamlessly (e.g. dark mode, geolocation, notifications). Works reliably across devices** |

### 6. Application Design & Presentation (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | Poor layout, dummy content, unclear navigation |
| Satisfactory | 2 | Basic design with some content. Limited responsiveness |
| Good | 3 | Adequate design, real content, clear navigation. Mostly responsive |
| Very Good | 4 | Strong design, optimized media, good usability. Fully responsive |
| **Excellent** | **5** | **Professional-quality design. Polished UI, optimized performance, excellent responsiveness. Clear documentation provided** |

### 7. Discretionary Marks (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | Incomplete system. Cannot explain implementation |
| Satisfactory | 2 | Functional but lacks polish. Limited ability to explain design choices |
| Good | 3 | Functional, readable code. Can explain main implementation choices |
| Very Good | 4 | Well-structured project, clean code, strong explanations |
| **Excellent** | **5** | **Professional finish. Demonstrates innovation (e.g. JWT auth, advanced caching). Excellent explanations and Q&A** |

---

## 1. PWA Implementation & Testing (15 marks) → **Target: Excellent (14–15)**

| Evidence | Location |
|----------|----------|
| **Service worker** | `Task 1/client/public/sw.js` – install, activate, fetch (stale-while-revalidate for same-origin GET), push and notificationclick handlers |
| **Manifest file** | `Task 1/client/public/manifest.json` – name, short_name, description, start_url, display (standalone), theme_color, background_color, icons |
| **Optimized caching (stale-while-revalidate)** | `sw.js`: for same-origin GET, return cached response if available while revalidating in background; on network failure serve from cache; network-first then cache fallback for navigation |
| **Offline-first / offline mode** | Fetch handler serves from cache when offline; fallback to `/index.html` for SPA routes; SW caches GET responses |
| **Installability** | Manifest + SW + HTTPS; install prompt available; custom icon in manifest |
| **Push notifications** | `sw.js`: `push` and `notificationclick` listeners; `registerSW.js`: `requestNotificationPermission()` |
| **Lighthouse PWA ≥90** | Run Lighthouse (Chrome DevTools) on the **deployed** frontend URL (HTTPS); fix any PWA issues until score ≥90 |
| **Secure hosting + HTTPS** | Deploy frontend to Netlify/Vercel/Firebase (HTTPS by default). See `Task 2/DEPLOYMENT.md`. |

---

## 2. API Development (15 marks) → **Target: Excellent (14–15)**

| Evidence | Location |
|----------|----------|
| **REST API with Express** | `Task 2/server/src/index.js` – Express app, CORS, JSON body parser |
| **Full CRUD** | Create: POST; Retrieve: GET, GET/:id; Update: PUT/:id; Delete: DELETE/:id for workshops, events, products; GET/POST bookings |
| **Comprehensive validation** | `Task 2/server/src/middleware/validation.js` – express-validator rules for POST/PUT (required, types, ranges); `handleValidationErrors` returns 400 with message |
| **Robust error handling** | Validation → 400; not found → 404; server errors → 500; JSON `{ error: true, message }`; central error middleware |
| **Sanitization (secure practices)** | String inputs trimmed and validated; parameterized DB queries (no raw interpolation); optional sanitization in routes (see `Task 2/server/src/middleware/validation.js` and route handlers) |
| **Clean modular code** | Routes in `src/routes/` (workshops, events, products, bookings); validation in `src/middleware/validation.js`; DB in `src/db/` |
| **Well-documented** | `Task 2/README.md`, `Task 2/DEPLOYMENT.md`, and `Task 2/server/API.md` (endpoints, request/response format) |
| **RESTful design** | Resource-based URLs, correct HTTP methods and status codes, stateless |

---

## 3. Database Integration (10 marks) → **Target: Excellent (9–10)**

| Evidence | Location |
|----------|----------|
| **Database** | MySQL via `mysql2` – `Task 2/server/src/db/database.js` |
| **Structured data / schema** | `Task 2/server/src/db/schema.sql` – tables: workshops, events, products, bookings; appropriate columns and types |
| **Store / retrieve (CRUD)** | INSERT in POST routes; SELECT in GET routes; UPDATE/DELETE in PUT/DELETE routes; parameterized queries |
| **Efficient queries & indexing** | Single-table SELECTs with optional filters (category, search, upcoming); primary key indexing for GET by id |
| **Relationships** | `bookings` table links to workshops, events, and users (workshop_id, event_id, user_id) for relationship support |
| **Validation at DB level** | `schema.sql`: NOT NULL on required fields; CHECK on `products.sustainability_rating` (1–5) and `bookings.status` (pending/confirmed/cancelled/completed); UNIQUE on `products.sku` |
| **Well-documented schema** | `Task 2/server/src/db/schema.sql` documents tables and constraints; seed script and API docs reference schema |
| **Seed data** | `Task 2/server/src/db/seed.js` – sample workshops, events, products for testing |

---

## 4. Frontend Integration (10 marks) → **Target: Excellent (9–10)**

| Evidence | Location |
|----------|----------|
| **React SPA** | `Task 1/client` – React app with Vite, client-side routing |
| **Dynamic fetch from API** | `Task 1/client/src/services/api.js` – `backendApi` (axios) calls `/api/workshops`, `/api/events`, `/api/products`; used in Workshops, Events, Products, Admin, ApiDetail pages |
| **Search, filter, sort** | `Task 1/client/src/pages/Home.jsx` – filter by content category (Food/Lifestyle/Education) and type (Workshop/Product/Event); **Sort by** (price, date, name). List pages use API where wired |
| **Master–detail view** | Home: select category → filtered list → click item → Detail page (`/item/:id` or `/workshop/:id`, `/event/:id`, `/product/:id`). Detail page shows full item and “Related” items linking to other details |
| **Loading states** | `Home.jsx`, `Detail.jsx`, `ApiDetail.jsx`, `Workshops.jsx`, `Events.jsx`, `Products.jsx`, `Admin.jsx`, `Reviews.jsx`, `NearbyEvents.jsx`, `WeatherWidget.jsx` – loading flags and UI (e.g. "Loading…", skeletons) |
| **Robust error handling** | API errors caught and displayed (e.g. Home, Detail, Login, Register, Admin, BookingForm, WeatherWidget); `handleApiError` in `api.js`; form validation errors in BookingForm, FormInput, FormSelect |
| **Accessibility** | Semantic HTML, ARIA (e.g. `aria-live`, `aria-label`, `role="status"` on loading); skip link; focus states; `aria-invalid`/`aria-describedby` on form errors |
| **Clean UI / dynamic updates** | Tailwind styling; data-driven lists and detail views; theme and language toggles |

---

## 5. Mobile Device Capabilities (5 marks) → **Target: Excellent (5)**

| Evidence | Location |
|----------|----------|
| **Dark mode** | `Task 1/client/src/contexts/ThemeContext.jsx` – theme state, toggle, `dark` class on `<html>`, localStorage; Navbar theme toggle; `dark:` Tailwind variants across layout and components |
| **Geolocation** | `Task 1/client/src/components/WeatherWidget.jsx` and `services/api.js` – `getUserLocation()`, `getWeatherWithLocation()` use browser geolocation for local weather |
| **Push notifications** | `Task 1/client/public/sw.js` – `push` and `notificationclick` listeners; `registerSW.js` – `requestNotificationPermission()`; can be called from app to enable notifications for updates |
| **Robust offline access** | Service worker caches GET requests and serves cached content when offline; fallback to `index.html` for SPA navigation |

*(All four implemented: dark mode, geolocation, push notifications, robust offline access — integrated seamlessly; works reliably across devices.)*

---

## 6. Application Design & Presentation (5 marks) → **Target: Excellent (5)**

| Evidence | Location |
|----------|----------|
| **Appropriate content** | Eco-friendly events, workshops, products with titles, descriptions, categories, pricing, availability |
| **Responsive layout** | Tailwind breakpoints (`md:`, `lg:`), flexible grids and nav; mobile-first approach |
| **Optimized media** | Images via URLs (Unsplash or API); lazy loading where used; consider image optimization in production |
| **Functional navigation** | `Task 1/client/src/components/Navbar.jsx` – Home, Workshops, Events, Products, Book Now, theme/language toggles, Login/Register or Logout |
| **Polish & usability** | Consistent styling, loading/error states, focus states and accessibility (skip link, ARIA) |
| **Explanation of implementation / documentation** | `Task 1/client/DEVELOPMENT_PROCESS.md`; this checklist; `Task 2/README.md`, `Task 2/DEPLOYMENT.md`; `Task 2/server/API.md` — clear documentation provided |
| **Professional-quality design** | Polished UI (Tailwind, custom eco palette, Poppins font); optimized performance (lazy loading, SW caching); excellent responsiveness (mobile-first, breakpoints) |

---

## 7. Discretionary Marks (5 marks) → **Target: Excellent (5)**

| Evidence | Location |
|----------|----------|
| **Multilingual support** | `Task 1/client` – react-i18next; English and Spanish; language switcher in Navbar; `src/i18n/` |
| **Structured validation & error handling** | Express validators and central error handler; frontend form validation and API error handling |
| **Completeness** | Full CRUD for workshops, events, products; bookings; PWA + API + DB + frontend integration |
| **Innovation** | Advanced caching (stale-while-revalidate in `sw.js`); multilingual support (react-i18next); optional: JWT on Express, cache API in SW — strengthens excellent band |
| **Excellent explanations and Q&A** | `DEVELOPMENT_PROCESS.md`, `MARKING_SCHEME_CHECKLIST.md`, `API.md`, `DEPLOYMENT.md`; code comments and structure support explanation of design choices |

---

## Summary Table

| Criteria | Marks | Evidence summary |
|----------|-------|------------------|
| PWA Implementation & Testing | 15 | Service worker, manifest, caching, offline, installability; deploy with HTTPS; run Lighthouse for PWA score |
| API Development | 15 | Express CRUD, validation, error handling, RESTful |
| Database Integration | 10 | SQLite, schema, seed, store/retrieve in routes |
| Frontend Integration | 10 | React SPA, API fetch, search/filter, master–detail |
| Mobile Device Capabilities | 5 | Dark mode, geolocation, push, offline (≥2) |
| Application Design & Presentation | 5 | Content, responsive, nav, polish, explanation |
| Discretionary | 5 | i18n, completeness, robustness |
| **Total** | **65** | |

Use this checklist when submitting or marking to ensure each criterion is addressed.
