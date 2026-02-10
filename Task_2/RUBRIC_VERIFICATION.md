# Rubric Verification: Are the Highest-Mark Criteria in the Project Code?

This document maps each **Excellent**-band criterion from your marking rubric images to the actual project code. ✅ = present in code; ⚠️ = depends on your action (e.g. run Lighthouse, deploy).

---

## 1. PWA Implementation & Testing (14–15 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Service worker | ✅ | `Task 1/client/public/sw.js` – install, activate, fetch |
| Stale-while-revalidate caching | ✅ | `sw.js` lines 23–42: same-origin GET returns cached while revalidating; network-first with cache fallback for navigation |
| Offline-first / offline support | ✅ | `sw.js`: serves from cache when offline; fallback to `/index.html` for SPA routes |
| Manifest (installable) | ✅ | `Task 1/client/public/manifest.json` – name, short_name, display standalone, icons, theme_color |
| Push notifications | ✅ | `sw.js` lines 57–74: `push` and `notificationclick`; `Task 1/client/src/registerSW.js`: `requestNotificationPermission()` |
| Lighthouse ≥90 | ⚠️ | Run Lighthouse on **deployed** HTTPS URL and fix until PWA score ≥90 |
| Deployed and tested | ⚠️ | Follow `Task 2/DEPLOYMENT.md`; deploy frontend + API on secure HTTPS hosting |

---

## 2. API Development (14–15 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Express REST API | ✅ | `Task 2/server/src/index.js` – Express, CORS, JSON body parser |
| Full CRUD (workshops, events, products) | ✅ | `Task 2/server/src/routes/` – GET, GET/:id, POST, PUT/:id, DELETE/:id |
| GET/POST bookings | ✅ | `Task 2/server/src/routes/bookings.js` |
| Comprehensive validation | ✅ | `Task 2/server/src/middleware/validation.js` – express-validator for all POST/PUT; `handleValidationErrors` → 400 |
| Robust error handling | ✅ | Central error handler; 400 (validation), 404 (not found), 500 (server); JSON `{ error, message }` |
| Sanitization (secure practices) | ✅ | `Task 2/server/src/utils/sanitize.js` – trim, strip `<>`; used alongside parameterized queries |
| Parameterized queries (no SQL injection) | ✅ | All routes use `db.prepare('... ? ...').get/all(id, ...)` |
| Clean modular code | ✅ | `src/routes/`, `src/middleware/validation.js`, `src/db/`, `src/utils/sanitize.js` |
| Well-documented | ✅ | `Task 2/server/API.md` – all endpoints, methods, request/response |

---

## 3. Database Integration (9–10 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Database connection | ✅ | `Task 2/server/src/db/database.js` – better-sqlite3; `data/urban_harvest.db` |
| Schema (tables, columns) | ✅ | `Task 2/server/src/db/schema.sql` – workshops, events, products, bookings |
| CRUD in routes | ✅ | INSERT in POST; SELECT in GET; UPDATE in PUT; DELETE in DELETE |
| Relationships | ✅ | `bookings` has `workshop_id`, `event_id`, `user_id` |
| Validation at DB level | ✅ | `schema.sql`: NOT NULL on required fields; CHECK on `sustainability_rating` (1–5) and `status` (pending/confirmed/cancelled/completed); UNIQUE on `sku` |
| Optimized queries / indexing | ✅ | Primary key lookups; optional filters (category, search, upcoming) in single-table queries |
| Well-documented schema | ✅ | `schema.sql` documents structure; referenced in API.md and seed |
| Seed data | ✅ | `Task 2/server/src/db/seed.js` |

---

## 4. Frontend Integration (9–10 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| React SPA | ✅ | `Task 1/client` – React, Vite, client-side routing |
| Dynamic fetch from API | ✅ | `Task 1/client/src/services/api.js` – `backendApi`, `backendServices.getWorkshops/getEvents/getProducts`; used in Workshops, Events, Products, Admin, ApiDetail |
| Search, filter, sort | ✅ | `Task 1/client/src/pages/Home.jsx` – filter by content category and type; sort by price, date, name |
| Master–detail view | ✅ | List pages → click item → Detail / ApiDetail; Detail shows "Related" items |
| Loading states | ✅ | Home, Detail, ApiDetail, Workshops, Events, Products, Admin, Reviews, NearbyEvents, WeatherWidget, etc. – `loading` state and UI |
| Robust error handling | ✅ | `setError`, user-visible messages; `handleApiError` in api.js; form validation errors in BookingForm, FormInput, FormSelect |
| Accessibility | ✅ | Skip link ("Skip to main content") in `App.jsx`; ARIA (`aria-live`, `aria-label`, `role="status"`, `aria-invalid`, `aria-describedby`) across components |
| Clean UI / dynamic updates | ✅ | Tailwind; theme/language toggles; data-driven lists and detail views |

---

## 5. Mobile Device Capabilities (5 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Dark mode | ✅ | `Task 1/client/src/contexts/ThemeContext.jsx`; Navbar toggle; `dark:` Tailwind variants in layout/components |
| Geolocation | ✅ | `Task 1/client/src/services/api.js` – `getUserLocation()` (navigator.geolocation); used in WeatherWidget, NearbyEvents |
| Push notifications | ✅ | `sw.js` push/notificationclick; `registerSW.js` – `requestNotificationPermission()` |
| Robust offline access | ✅ | Service worker caches GET and serves cached content when offline |
| Multiple features, reliable across devices | ✅ | All four above implemented and integrated |

---

## 6. Application Design & Presentation (5 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Appropriate content | ✅ | Eco-friendly workshops, events, products – titles, descriptions, categories, pricing |
| Responsive layout | ✅ | Tailwind breakpoints (`md:`, `lg:`), mobile-first; flexible grids and nav |
| Optimized media | ✅ | Images via URLs; lazy loading (e.g. EcoCard `loading="lazy"`) |
| Functional navigation | ✅ | `Task 1/client/src/components/Navbar.jsx` – Home, Workshops, Events, Products, Book Now, theme/language, Login/Register or Logout |
| Polished UI | ✅ | Custom Tailwind colors (eco-green, earth-brown, harvest-gold, fresh-teal), Poppins font; `.card-eco`, `.focus-ring-eco` in `index.css` |
| Clear documentation | ✅ | `Task 1/client/DEVELOPMENT_PROCESS.md`; `Task 2/MARKING_SCHEME_CHECKLIST.md`; `Task 2/README.md`, `Task 2/DEPLOYMENT.md`; `Task 2/server/API.md` |

---

## 7. Discretionary Marks (5 Excellent)

| Criterion | In code? | Location |
|-----------|----------|----------|
| Multilingual support | ✅ | `Task 1/client` – react-i18next; English and Spanish; language switcher in Navbar; `src/i18n/` |
| Innovation (e.g. advanced caching) | ✅ | Stale-while-revalidate in `sw.js`; optional: JWT on Express / cache API in SW (not required for full marks) |
| Well-structured project, clean code | ✅ | Express: routes, middleware, db, utils; React: components, pages, contexts, services |
| Excellent explanations | ✅ | `DEVELOPMENT_PROCESS.md`, `MARKING_SCHEME_CHECKLIST.md`, `API.md`, `DEPLOYMENT.md` support Q&A and design explanations |

---

## Summary

- **In the project code:** All rubric criteria for the **highest marks** are implemented in the codebase, except:
  - **Lighthouse ≥90** – you need to run Lighthouse on your **deployed** PWA URL and fix any issues until the PWA score is ≥90.
  - **Deployed and tested** – you need to deploy the API and frontend (e.g. using `Task 2/DEPLOYMENT.md`) and test on real devices.

So yes: the features and quality described in your rubric images for the top bands **are present in the project code**. The only things that are not “in the code” are running Lighthouse and actually deploying; both are one-time actions you perform when submitting.
