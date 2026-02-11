# Urban Harvest Hub – REST API Reference (Task 2)

Base URL: `http://localhost:5000` (or your deployed API URL). All responses are JSON.

---

## Authentication & roles

- **Login:** `POST /api/auth/login` with body `{ "username", "password" }` returns a JWT in `data.token`. Use it in Postman as **Authorization: Bearer &lt;token&gt;**.
- **Roles:** `user` (default) and `admin`.
  - **Admin only:** POST/PUT/DELETE on workshops, events, products; GET `/api/auth/users`. Without admin token these return **403** (Admin access required).
  - **Any logged-in user:** GET/POST bookings (own), GET/POST/PUT subscriptions (own), POST reviews, GET `/api/auth/me`. Without a valid token these return **401** (Authentication required).
- **Public (no auth):** GET workshops, GET events, GET products, GET reviews (with query params), POST `/api/auth/register`, POST `/api/auth/login`.
- **Creating an admin:** Run `node src/scripts/seed-admin.js` with your `MYSQL_*` env vars (same as API). That creates user **admin** / **adminpass** with role `admin`. Use that token in Postman to test catalog CRUD and GET `/api/auth/users`.

---

## Response Format

- **Success:** `{ "success": true, "data": ... }` (optional `"message"`).
- **Error:** `{ "error": true, "message": "..." }` with HTTP status 400 (validation), 404 (not found), or 500 (server error).

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service status and version. |

---

## Workshops

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/workshops` | List all workshops. Query: `upcoming=true`, `category`, `search`. |
| GET | `/api/workshops/:id` | Get one workshop by id. |
| POST | `/api/workshops` | **Admin.** Create workshop. Body: `title`, `description`, `date`, `time`, `price` (required); `category`, `max_participants`, `location`, `instructor_name`, `image_url` (optional). |
| PUT | `/api/workshops/:id` | **Admin.** Update workshop. Body: any subset of fields. |
| DELETE | `/api/workshops/:id` | **Admin.** Delete workshop. |

---

## Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | List all events. Query: `upcoming=true`, `category`, `is_free=true`. |
| GET | `/api/events/:id` | Get one event by id. |
| POST | `/api/events` | **Admin.** Create event. Body: `title`, `description`, `date`, `time`, `location` (required); `category`, `organizer`, `is_free`, `price`, `image_url` (optional). |
| PUT | `/api/events/:id` | **Admin.** Update event. Body: any subset of fields. |
| DELETE | `/api/events/:id` | **Admin.** Delete event. |

---

## Products

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (in stock only by default). Query: `include_out_of_stock=true`, `category`, `search`. |
| GET | `/api/products/:id` | Get one product by id. |
| POST | `/api/products` | **Admin.** Create product. Body: `name`, `description`, `price` (required); `category`, `stock_quantity`, `sku`, `image_url`, `sustainability_rating` 1–5 (optional). |
| PUT | `/api/products/:id` | **Admin.** Update product. Body: any subset of fields. |
| DELETE | `/api/products/:id` | **Admin.** Delete product. |

---

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register. Body: `full_name`, `username`, `email`, `password`. Returns user + token. |
| POST | `/api/auth/login` | Login. Body: `username`, `password`. Returns user + token. |
| GET | `/api/auth/me` | **Auth.** Current user (from JWT). |
| GET | `/api/auth/users` | **Admin.** List all users (no password_hash). |

---

## Bookings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bookings` | **Auth.** List current user's bookings. |
| POST | `/api/bookings` | **Auth.** Create booking. Body: `booking_date` (required); `workshop_id` or `event_id` (one required); `participants`, `special_requirements` (optional). `user_id` is taken from token. |

---

## Validation & Errors

- **POST/PUT:** Required fields and types are validated (e.g. `date` as ISO date, `price` ≥ 0). Invalid input returns **400** with `message` describing the error.
- **Not found:** Missing resource returns **404** with `message`.
- **Server error:** Unhandled errors return **500** with `message`.

All database access uses parameterized queries. String inputs are trimmed and validated via express-validator.
