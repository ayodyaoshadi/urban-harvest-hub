# Assignment Specification & Task 1 Checklist

This document verifies that the **Assignment Specification** (scenario + platform) and **Task 1** requirements are present in the code.

---

## Assignment Specification (Scenario & Platform)

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| **Showcase and manage eco-friendly initiatives** – workshops, local events, sustainable products | ✅ | `Task_1/client`: Home, Workshops, Events, Products pages; `items.json` and API data with categories (food, lifestyle, education). Task_2/server: CRUD for workshops, events, products. |
| **SPA for desktop** | ✅ | React + Vite SPA in `Task_1/client`; client-side routing in `App.jsx`. |
| **PWA for mobile** – offline, installable, push notifications | ✅ | `Task_1/client/public/sw.js` (caching, offline), `manifest.json` (installable), push/notificationclick in `sw.js`; `registerSW.js` for registration. |
| **Backend REST API + database** for workshops, events, products | ✅ | `Task_2/server`: Express REST API; SQLite in `src/db/` (schema, seed). |
| **Consumed by SPA** | ✅ | `Task_1/client/src/services/api.js`: `backendApi`, `backendServices.getWorkshops/getEvents/getProducts`; used in Home, Workshops, Events, Products, Admin, ApiDetail. |
| **User roles – Community members:** view and book workshops/events, subscribe to product boxes, leave reviews | ✅ | Booking: `Booking.jsx`, `BookingForm.jsx`; Subscribe: `SubscribeBox.jsx`; Reviews: `Reviews.jsx`. Auth: `AuthContext.jsx`. |
| **User roles – Administrators:** add, edit, remove content (events, workshops, products) | ✅ | `Admin.jsx`: tabs for events/workshops/products; create, edit, delete via `backendServices`. |
| **At least one external API** (e.g. weather, maps, payment) | ✅ | **Weather:** `api.js` – Open-Meteo (`fetchWeather`, `getUserLocation`); **Maps:** `LocationMap.jsx` (Nominatim/OSM). WeatherWidget, NearbyEvents use weather/geolocation. |
| **Accessibility and inclusivity** – responsive, ARIA, multilingual | ✅ | Responsive: Tailwind breakpoints. ARIA/semantic: skip link, `role="main"`, `aria-label`, `aria-*` across components. Focus: `.focus-ring-eco`, `:focus-visible` in `index.css`. |
| **Multilingual: English + one other language** | ✅ | `Task_1/client/src/i18n/`: `en.json`, `es.json`, `si.json`; react-i18next; language switcher in Navbar. |
| **Deployed in production (frontend + backend), HTTPS, tested** | ⚠️ | Docs: `Task_1/DEPLOYMENT.md`, `Task_2/DEPLOYMENT.md`. You must deploy and test; code supports it. |

---

## Task 1 – Client-Side SPA (5 marks)

| Criterion | In code? | Location / evidence |
|-----------|----------|---------------------|
| **Built using Vue or React with Vite** | ✅ | `Task_1/client/package.json`: react, vite, react-router-dom; `vite.config.js`. |
| **Routing for multiple views** – home, categories, detail, booking | ✅ | `App.jsx`: `/`, `/workshops`, `/products`, `/events`, `/booking`, `/booking-success`, `/item/:id`, `/products/:id`, `/workshop/:id`, `/event/:id`, `/product/:id`, `/login`, `/register`, `/admin`, `/api-demo`. |
| **Meets all functional requirements of the scenario** | ✅ | Eco content, filter/explore, detail views, book/register, roles, external API, accessibility, i18n (see above). |

---

## Task 1 – Component-Based Design (10 marks)

| Criterion | In code? | Location / evidence |
|-----------|----------|---------------------|
| **Reusable components** – cards, lists, forms, navigation | ✅ | `EcoCard`, `EcoCardGrid`, `EcoCardSkeleton`; `BookingForm`, `FormInput`, `FormSelect`; `Navbar`; `WeatherWidget`, `SustainabilityTips`, `NearbyEvents`, `Reviews`, `SubscribeBox`, `LocationMap`, `ApiDocumentation`. |
| **Data/state passed effectively** – props, state, context | ✅ | Props: e.g. EcoCard (`item`, `detailPath`), EcoCardGrid (`items`, `loading`, `columns`, `detailPath`). State: `useState` in pages. Context: `AuthContext`, `ThemeContext` for user and theme. |
| **Modular design and separation of concerns** | ✅ | `components/`, `pages/`, `contexts/`, `services/api.js`, `i18n/`, `utils/validation.js`. |

---

## Task 1 – Data Handling (10 marks)

| Criterion | In code? | Location / evidence |
|-----------|----------|---------------------|
| **(1) Internal JSON file for static seed data** | ⚠️ | `Task_1/client/src/data/items.json` exists with categories (food, lifestyle, education), workshops, events, products. **Home currently loads only from the REST API.** To satisfy “reads from internal JSON”, add a fallback in Home (e.g. when API fails or when `VITE_API_URL` is unset) to `import('../data/items.json')` and set items from it, or load it in one other view. |
| **(2) External API** (e.g. weather, events, products) | ✅ | **Weather:** `api.js` – Open-Meteo `fetchWeather`, `getUserLocation`; used in `WeatherWidget`, `NearbyEvents`. Backend API also used for workshops/events/products. |
| **At least one master–detail view** | ✅ | Home (filter by category/type) → list of items → click → Detail or ApiDetail with full item and “Related items”. |
| **Basic state management** – React Context / Vue reactive state | ✅ | `AuthContext.jsx` (user, login, register), `ThemeContext.jsx` (theme, toggle); `useState`/`useEffect` in pages. |

---

## Task 1 – Tailwind Styling (5 marks)

| Criterion | In code? | Location / evidence |
|-----------|----------|---------------------|
| **At least two pages styled with Tailwind** | ✅ | All main pages use Tailwind (Home, Workshops, Products, Events, Detail, ApiDetail, Booking, Admin, Login, Register, etc.). |
| **Tailwind config extended with two new colours** | ✅ | `tailwind.config.js`: `eco-green`, `earth-brown`, `harvest-gold`, `fresh-teal` (≥ 2). |
| **One new font** | ✅ | `tailwind.config.js`: `fontFamily.sans: ['Poppins', ...]`. |
| **At least one custom utility or component via @layer** | ✅ | `index.css`: `@layer components { .card-eco { ... } }`, `@layer utilities { .focus-ring-eco { ... } }`. Used in EcoCard (card-eco), App (focus-ring-eco on skip link). |

---

## Task 1 – Discretionary (5 marks)

| Criterion | In code? | Location / evidence |
|-----------|----------|---------------------|
| **Overall design quality, usability, responsiveness** | ✅ | Tailwind layout, responsive breakpoints, consistent styling, loading/error states. |
| **Accessibility** – semantic HTML, ARIA, keyboard navigation | ✅ | Semantic: `<main>`, `<section>`, `<article>`, lists. ARIA: `aria-label`, `aria-live`, `aria-pressed`, `role="main"`, etc. Skip link; `.focus-ring-eco`, `:focus-visible`. |
| **Form validation** (e.g. bookings/subscriptions) | ✅ | `BookingForm.jsx` – validation and error state; `FormInput`/`FormSelect` with error props; backend validation via API. |

---

## Task 1 Requirements (narrative)

| Requirement | In code? | Location / evidence |
|-------------|----------|---------------------|
| **Promote eco-friendly content** – products, workshops, events with categories (e.g. food, lifestyle, education) | ✅ | `items.json` and API data use `contentCategory` / category; Home filters by Food, Lifestyle, Education and type (Workshop/Product/Event). |
| **Dynamic exploration** – filter, explore categories, view details (images, descriptions, availability, pricing), book/register | ✅ | Home: filter by content category and type; sort (price, date, name). Detail/ApiDetail: images, descriptions, availability, pricing. Booking page and BookingForm for book/register. |
| **Master–detail view** – selecting a category displays related items | ✅ | Home: select category/type → filtered list → click item → Detail or ApiDetail; Detail shows “Related items” linking to other details. |
| **Routing** – client-side routing (e.g. `/products/:id`) | ✅ | `App.jsx`: `/products/:id`, `/workshop/:id`, `/event/:id`, `/product/:id`, `/item/:id`, etc. |
| **Accessibility** – semantic HTML, ARIA roles, focus states | ✅ | See Discretionary row above. |

---

## Summary

- **Assignment scenario & platform:** All requirements are in the code except **deployment/testing**, which you do when you deploy and test.
- **Task 1 marking:** All criteria are met except one possible gap:
  - **Data Handling (1) internal JSON:** The file `src/data/items.json` exists and has the right structure. The app currently loads data from the **REST API** (and external weather API). To explicitly satisfy “reads from internal JSON”, add a fallback in `Home.jsx` (e.g. when the API fails or when running without backend) that loads `items.json` and uses it for the list. Then both (1) internal JSON and (2) external API are clearly used.

If you want, we can add that fallback in `Home.jsx` so internal JSON is clearly used.
