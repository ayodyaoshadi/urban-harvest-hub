# Task 1 Code vs Marking Rubric

How your code aligns with the **Client-Side SPA**, **Component-Based Design**, and **Data Handling** rubric (targeting the top band in each).

---

## 1. Client-Side SPA (max 5) → **Excellent (5)**

| Rubric (Excellent) | In your code? | Evidence |
|--------------------|----------------|----------|
| Professional-quality SPA with well-structured routing (including dynamic parameters) | ✅ | `App.jsx`: React Router with `/`, `/workshops`, `/products`, `/events`, `/booking`, `/item/:id`, `/products/:id`, `/workshop/:id`, `/event/:id`, `/product/:id` – dynamic params for detail views. |
| Meets all scenario requirements and demonstrates scalability | ✅ | Eco content (workshops, events, products); categories (food, lifestyle, education); filter/sort; detail views; booking; login/register; admin; external API (weather); i18n. Structure (pages, components, services) scales. |

**Verdict:** **5/5** – React + Vite, full routing with dynamic routes, all required views (home, categories, detail, booking), scenario covered.

---

## 2. Component-Based Design (max 10) → **Excellent (9–10)**

| Rubric (Excellent) | In your code? | Evidence |
|--------------------|----------------|----------|
| Professional, scalable component architecture | ✅ | `components/`: EcoCard, EcoCardGrid, EcoCardSkeleton, BookingForm, FormInput, FormSelect, Navbar, WeatherWidget, Reviews, SubscribeBox, LocationMap, etc. `pages/` use these; no single monolithic file. |
| Effective use of props, context/state management, and reusable design patterns | ✅ | **Props:** EcoCard receives `item`, `detailPath`; EcoCardGrid receives `items`, `loading`, `columns`, `detailPath`. **Context:** AuthContext (user, login, register, isAdmin) and ThemeContext (theme, toggle) used in Navbar, Admin, Login, etc. **State:** useState in pages for list/detail/loading/error. Reusable grid + card pattern across Home, Workshops, Products, Events. |

**Verdict:** **9–10/10** – Clear separation (components, pages, contexts, services), props and context used consistently, reusable cards/lists/forms.

---

## 3. Data Handling (max 10) → **Excellent (9–10)**

| Rubric (Excellent) | In your code? | Evidence |
|--------------------|----------------|----------|
| Robust handling of static + dynamic data with clear error handling | ✅ | **Static:** Internal `src/data/items.json` loaded when API is down (Home, Workshops, Products, Events). **Dynamic:** REST API (workshops, events, products) and Open-Meteo weather API. **Error handling:** loading/error state in pages; fallback to JSON on API failure; user-visible messages. |
| Strong master–detail views, filtering/sorting | ✅ | **Master–detail:** Home (filter by category/type) → list → click item → Detail or ApiDetail; Detail page shows “Related items” linking to other details. **Filtering:** Content category (food, lifestyle, education) and type (Workshop, Product, Event). **Sorting:** Price (asc/desc), date (asc/desc), name. |
| Effective use of Context API for state management | ✅ | AuthContext (user, login, register, logout, isAdmin); ThemeContext (theme, toggle). Both used across Navbar, Admin, Login, Register, layout. |

**Verdict:** **9–10/10** – Reads from internal JSON and external APIs; master–detail with related items; filter/sort; Context for auth and theme; clear error and loading handling.

---

## 4. Tailwind Styling (max 5) → **Excellent (5)**

| Rubric (Excellent) | In your code? | Evidence |
|--------------------|----------------|----------|
| Polished, professional styling across the app | ✅ | Tailwind used on all pages (Home, Workshops, Products, Events, Detail, Booking, Admin, Login, Register, etc.); consistent eco palette (eco-green, earth-brown, harvest-gold, fresh-teal); Poppins font; responsive breakpoints (`md:`, `lg:`). |
| Tailwind config extended with multiple custom utilities/components | ✅ | **Config:** `tailwind.config.js` – four custom colours (eco-green, earth-brown, harvest-gold, fresh-teal), one custom font (Poppins), `darkMode: 'class'`. **Custom layers:** `index.css` – `@layer components { .card-eco }`, `@layer utilities { .focus-ring-eco }`; used on cards and skip link. |
| Seamless light/dark mode | ✅ | `ThemeContext.jsx` – theme state, toggle, `dark` class on `<html>`, localStorage persistence, respects system preference on first load. Navbar theme toggle; `dark:` variants applied across App, EcoCard, Navbar, Detail, Booking, forms, etc. |

**Verdict:** **5/5** – Multiple pages styled; config extended with colours, font, and custom component/utility via @layer; light/dark mode works across the app.

---

## 5. Discretionary Marks (max 5) → **Excellent (5)**

| Rubric (Excellent) | In your code? | Evidence |
|--------------------|----------------|----------|
| Professional design and UX | ✅ | Clear layout, loading/error states, success feedback (e.g. booking success), consistent styling, responsive design. |
| Accessibility best practices (ARIA, keyboard navigation) | ✅ | **ARIA:** `aria-label`, `aria-pressed`, `aria-live`, `aria-invalid`, `aria-describedby`, `role="main"`, `role="article"`, `role="group"`, `role="alert"` used in App, Navbar, Detail, Home, forms. **Keyboard:** Skip link (“Skip to main content”) visible on focus; `:focus-visible` and `.focus-ring-eco` in `index.css`; tab order follows layout. |
| Form validation integrated | ✅ | `BookingForm.jsx` – required fields, email/phone patterns, date and participant rules; `utils/validation.js` (validationRules, validateField, validateForm); per-field errors and submit validation; scroll to first error and focus; FormInput/FormSelect with `error`, `required`; `aria-invalid` and `aria-describedby` on errors. |
| Excellent articulation of development process | ✅ | `DEVELOPMENT_PROCESS.md` – approach, structure, design choices, accessibility, form validation, Tailwind customisation, testing. Explains routing, components, data, state, light/dark mode, ARIA, keyboard, and validation. |

**Verdict:** **5/5** – Professional UX; ARIA and keyboard navigation in place; form validation (booking) fully integrated; development process clearly documented.

---

## Summary

| Criterion | Band | Marks | Comment |
|-----------|------|-------|---------|
| Client-Side SPA | Excellent | 5/5 | React + Vite, full routing (incl. dynamic params), all scenario requirements. |
| Component-Based Design | Excellent | 9–10/10 | Reusable components, props + context, clear structure. |
| Data Handling | Excellent | 9–10/10 | Internal JSON + external API, master–detail, filter/sort, Context, error handling. |
| **Tailwind Styling** | **Excellent** | **5/5** | Styling across app; config extended (colours, font, @layer components/utilities); seamless light/dark. |
| **Discretionary Marks** | **Excellent** | **5/5** | Professional design/UX; ARIA + keyboard; form validation; DEVELOPMENT_PROCESS.md. |

Your code matches the **Excellent** band for all five categories (including Tailwind Styling and Discretionary). No changes required for these criteria.
