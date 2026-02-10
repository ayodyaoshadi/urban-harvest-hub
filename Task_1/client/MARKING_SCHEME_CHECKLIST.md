# Task 1 Marking Scheme Checklist (35 marks)

This checklist maps the implementation to the marking criteria and **detailed marking ranges** for the Component-Based Web Application.

---

## Detailed Marking Ranges (Rubric Bands)

### 1. Client-Side SPA (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | Not Vue/React + Vite; no routing; single static page |
| Satisfactory | 2 | Basic setup; limited navigation; incomplete |
| Good | 3 | SPA with routing; meets some scenario requirements |
| Very Good | 4 | Fully functional routing; all views (home, categories, detail, booking) |
| **Excellent** | **5** | **Professional SPA; well-structured routing with dynamic params; meets all scenario requirements; demonstrates scalability** |

### 2. Component-Based Design (max 10)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–3 | No component structure; monolithic |
| Satisfactory | 4 | Basic components; repetitive; limited data flow |
| Good | 5–6 | Reusable components (cards, lists, forms); props/state sometimes inconsistent |
| Very Good | 7–8 | Strong modular design; clear data flow (props/state) |
| **Excellent** | **9–10** | **Professional, scalable architecture; effective props, context/state; reusable design patterns** |

### 3. Data Handling (max 10)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–3 | No data integration; hard-coded only |
| Satisfactory | 4 | Internal JSON only or broken external API; no master–detail |
| Good | 5–6 | JSON + one external API; basic master–detail |
| Very Good | 7–8 | JSON + external API working; master–detail smooth; basic state management |
| **Excellent** | **9–10** | **Robust static + dynamic data with clear error handling; strong master–detail, filtering/sorting; effective Context/state management** |

### 4. Tailwind Styling (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | No Tailwind or default styles only |
| Satisfactory | 2 | Basic Tailwind; minimal customisation; light/dark toggle not functional |
| Good | 3 | At least one page styled with Tailwind; config modified with one custom property |
| Very Good | 4 | Multiple pages styled; config extended with new colour and font |
| **Excellent** | **5** | **Polished, professional styling across the app; config extended with multiple custom utilities/components; seamless light/dark mode** |

### 5. Discretionary Marks (max 5)
| Band | Marks | Description |
|------|-------|-------------|
| Unsatisfactory | 0–1 | Poor design and usability; no explanation of development process |
| Satisfactory | 2 | Functional but plain; limited understanding of development process |
| Good | 3 | Usable design, some responsiveness; able to explain main parts of implementation |
| Very Good | 4 | Strong, responsive design; attention to accessibility; clear explanation of development choices |
| **Excellent** | **5** | **Professional design and UX; accessibility best practices (ARIA, keyboard navigation); form validation integrated; excellent articulation of development process** |

---

## 1. Client-Side SPA (5 marks) → **Target: Excellent (5)**

| Requirement | Location / Evidence |
|-------------|---------------------|
| Built using **Vue or React with Vite** | `package.json`: `react`, `react-dom`, `vite`; `vite.config.js` |
| Routing for multiple views (e.g. home, categories, detail, booking) | `App.jsx`: `<Router>`, `<Routes>` with paths `/`, `/workshops`, `/products`, `/events`, `/item/:id`, `/products/:id`, `/booking`, `/booking-success`, etc. |
| Meets all functional requirements of Urban Harvest Hub scenario | Home: eco content, categories (Food, Lifestyle, Education); Detail: images, descriptions, availability, pricing; Book/Register via `/booking`; master–detail (category → list → detail) |
| **Dynamic routing** (Excellent band) | `App.jsx`: `/item/:id`, `/products/:id`, `/workshop/:id`, `/event/:id` – dynamic parameters for detail views |

---

## 2. Component-Based Design (10 marks) → **Target: Excellent (9–10)**

| Requirement | Location / Evidence |
|-------------|---------------------|
| **Reusable components** (cards, lists, forms, navigation) | `EcoCard.jsx`, `EcoCardGrid.jsx`, `Navbar.jsx`, `BookingForm.jsx`, `FormInput.jsx`, `FormSelect.jsx`, `WeatherWidget.jsx`, `Reviews.jsx`, `SubscribeBox.jsx`, etc. |
| Data/state passed effectively (props, state, context) | Props: `EcoCard` (item, detailPath), `EcoCardGrid` (items, loading, columns, detailPath), `BookingForm` (workshop, onSuccess). State: `Home` (selectedContentCategory, filteredItems). Context: `AuthContext` (user, login, logout). |
| Modular design and separation of concerns | Pages in `pages/`, shared components in `components/`, services in `services/api.js`, validation in `utils/validation.js`, i18n in `i18n/` |
| **Reusable design patterns** (Excellent band) | Same `EcoCard`/`EcoCardGrid` used on Home, Workshops, Products, Events, Detail (related items); `FormInput`/`FormSelect` shared across forms |

---

## 3. Data Handling (10 marks) → **Target: Excellent (9–10)**

| Requirement | Location / Evidence |
|-------------|---------------------|
| **(1) Internal JSON file** for static seed data | `src/data/items.json` – loaded in `Home.jsx`, `Detail.jsx`, `Booking.jsx` / `BookingForm.jsx` |
| **(2) External API** (e.g. weather, events, products) | `services/api.js`: Open-Meteo (weather), Nominatim/OpenStreetMap (geocoding). `WeatherWidget.jsx` uses `fetchWeather` / `getWeatherWithLocation`. Backend API used for workshops, events, products when on those pages. |
| At least one **master–detail view** | Home: category selection (Food / Lifestyle / Education) → filtered list → click item → Detail page (`/item/:id`). Detail page: “Related [category]s” list linking to other detail views. |
| **Clear error handling** (Excellent band) | `Home.jsx`: `try/catch` on JSON load; `error` state + user message + “Refresh page” button. `Detail.jsx`: `catch` on JSON load; `error` state + “Something went wrong” message. Weather API: `catch` and fallback/message in `WeatherWidget`. |
| **Filtering and sorting** (Excellent band) | `Home.jsx`: filter by content category (Food/Lifestyle/Education) and type (Workshop/Product/Event); **Sort by**: Default, Price (asc/desc), Date (asc/desc), Name (A–Z). |
| **State management** (React Context) | `contexts/AuthContext.jsx`: `AuthProvider`, `useAuth()` (user, login, register, logout, isAdmin). Used in `Navbar`, `Login`, `Register`, `Admin`, etc. |

---

## 4. Tailwind Styling (5 marks) → **Target: Excellent (5)**

| Requirement | Location / Evidence |
|-------------|---------------------|
| **Polished, professional styling across the app** | All main pages use Tailwind consistently: `Home.jsx`, `Detail.jsx`, `Booking.jsx`, `Products.jsx`, `Workshops.jsx`, `Events.jsx`, etc. |
| Config **extended** with **two new colours** | `tailwind.config.js` → `theme.extend.colors`: `eco-green`, `earth-brown` (plus `harvest-gold`, `fresh-teal`) |
| Config **extended** with **one new font** | `tailwind.config.js` → `theme.extend.fontFamily.sans`: `['Poppins', 'system-ui', 'sans-serif']` |
| **Multiple custom utilities/components via @layer** (Excellent band) | `src/index.css`: `@layer components { .card-eco { ... } }` and `@layer utilities { .focus-ring-eco { ... } }`. Used: `EcoCard.jsx` (card-eco), `App.jsx` (focus-ring-eco on skip link). |
| **Seamless light/dark mode** (Excellent band) | `tailwind.config.js`: `darkMode: 'class'`. `contexts/ThemeContext.jsx`: theme state, toggle, `dark` class on `<html>`, localStorage persistence, system preference on first load. Navbar: theme toggle (☀️/🌙) with `aria-label` and `aria-pressed`. App, Home, Detail, Booking, EcoCard: `dark:` variants for background, text, borders. |

---

## 5. Discretionary Marks (5 marks) → **Target: Excellent (5)**

| Requirement | Location / Evidence |
|-------------|---------------------|
| **Professional design and UX** | Consistent eco palette, clear hierarchy, responsive layout, loading/error/success feedback, sort and filter controls. |
| **Accessibility best practices (ARIA, keyboard navigation)** | `index.css`: skip link (`.sr-only`), `:focus-visible` for links/buttons. `Detail.jsx`: `<article>`, `<section>`, `<dl>`/`<dt>`/`<dd>`, `aria-labelledby`, `aria-label`. `Home.jsx`: `aria-pressed`, `aria-live`, `role="group"`. Navbar: theme toggle and language buttons with `aria-pressed`/`aria-label`. Keyboard: focus states and tab order. |
| **Form validation integrated** | `utils/validation.js`: `validationRules`, `validateForm`, `validateField`. `BookingForm.jsx`: required fields, email/phone pattern, date/participants validation, agreeToTerms; errors shown; `sanitizeFormData` on submit. |
| **Excellent articulation of development process** | `client/DEVELOPMENT_PROCESS.md`: approach and structure, design and usability choices, accessibility, form validation, Tailwind customisation, testing and refinement. |

---

**Total: 35 marks.** Use this checklist to verify each criterion when marking.
