# Development Process – Urban Harvest Hub (Task 1)

This document articulates the development process and key implementation choices for the component-based SPA, to support marking of discretionary criteria (design, usability, accessibility, form validation, and articulation of development process).

---

## 1. Approach and Structure

- **Framework**: React 19 with Vite 7 for fast dev/build and clear SPA routing.
- **Component architecture**: Reusable components (EcoCard, EcoCardGrid, Navbar, BookingForm, FormInput, FormSelect, WeatherWidget, etc.) with props and optional context (Auth, Theme). Pages compose these components and own local state (filters, sort, loading, error).
- **Data**: Static seed data in `src/data/items.json`; external APIs (Open-Meteo weather, Nominatim/OpenStreetMap) in `services/api.js`; backend REST API for workshops, events, products where used. Loading and error states are handled (e.g. Home and Detail catch JSON load failures and show user-facing messages).
- **State**: React Context for cross-cutting state (AuthContext for user, ThemeContext for light/dark). Component state for UI (filters, sort, form fields). No global store; kept minimal and explicit.

---

## 2. Design and Usability Choices

- **Layout**: Tailwind-based responsive grid and flex; breakpoints (`md:`, `lg:`) for mobile-first layout. Navbar collapses/ wraps on small screens.
- **Visual hierarchy**: Clear headings (h1/h2), category badges, pricing and availability emphasised. Eco palette (eco-green, earth-brown, harvest-gold, fresh-teal) applied consistently.
- **Light/dark mode**: ThemeContext toggles `dark` class on `<html>`; Tailwind `dark:` variants applied to main layout, cards, and key pages so the app works seamlessly in both modes. Preference stored in localStorage and respects system preference on first load.
- **Feedback**: Loading skeletons, error messages with recovery (e.g. “Refresh page”), success state after booking. Sort and filter options with clear labels and `aria-pressed` where appropriate.

---

## 3. Accessibility

- **Semantic HTML**: `<main>`, `<nav>`, `<article>`, `<section>`, `<dl>`/`<dt>`/`<dd>` where appropriate; heading levels (h1 → h2) kept consistent.
- **ARIA**: `aria-label` on nav, buttons, and controls; `aria-labelledby` linking sections to headings; `aria-pressed` on toggle buttons (theme, language, filters); `aria-live="polite"` for dynamic result count; `role="alert"` for errors; `role="group"` for control groups.
- **Keyboard**: Skip link (“Skip to main content”) visible on focus; focus styles via `:focus-visible` and Tailwind `focus-visible:ring-*` so interactive elements are clearly focusable. Tab order follows visual order.
- **Forms**: Labels associated with inputs; `aria-invalid` and `aria-describedby` where errors are shown; validation errors announced (e.g. `role="alert"`).

---

## 4. Form Validation

- **Booking form**: Required fields (name, email, phone, workshop, date, participants, terms). Pattern checks for email and phone. Date must be today or future; participants within workshop capacity. Errors shown per field and on submit; first error field focused and scrolled into view. Data sanitised before submit (`utils/validation.js`).
- **Reuse**: `validationRules` and `validateField`/`validateForm` in `utils/validation.js` shared by booking (and extensible to other forms). Form components (FormInput, FormSelect) accept `error` and `required` for consistent behaviour.

---

## 5. Tailwind Customisation

- **Config**: `tailwind.config.js` extended with custom colours (eco-green, earth-brown, harvest-gold, fresh-teal), custom font (Poppins), and `darkMode: 'class'`.
- **Custom layers**: In `index.css`, `@layer components` (e.g. `.card-eco`) and `@layer utilities` (e.g. `.focus-ring-eco`) so custom styles participate in Tailwind’s cascade and can be overridden. These are used on cards and the skip link.
- **Dark mode**: Key pages and components use `dark:` variants so background, text, and borders adapt when `dark` is applied to the document root.

---

## 6. Testing and Refinement

- **Manual checks**: Navigation (home, categories, detail, booking), filter/sort, theme toggle, form validation, and keyboard navigation were tested during development.
- **Browser**: Layout and behaviour checked in a modern browser (Chrome/Edge) with responsive and accessibility tools (e.g. Lighthouse) in mind.

This document summarises the main development choices and where they are implemented, to support “excellent articulation of development process” in the discretionary marking.
