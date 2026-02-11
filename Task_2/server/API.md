# Urban Harvest Hub – REST API Reference (Task 2)

Base URL: `http://localhost:5000` (or your deployed API URL). All responses are JSON.

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
| POST | `/api/workshops` | Create workshop. Body: `title`, `description`, `date`, `time`, `price` (required); `category`, `max_participants`, `location`, `instructor_name`, `image_url` (optional). |
| PUT | `/api/workshops/:id` | Update workshop. Body: any subset of fields. |
| DELETE | `/api/workshops/:id` | Delete workshop. |

---

## Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | List all events. Query: `upcoming=true`, `category`, `is_free=true`. |
| GET | `/api/events/:id` | Get one event by id. |
| POST | `/api/events` | Create event. Body: `title`, `description`, `date`, `time`, `location` (required); `category`, `organizer`, `is_free`, `price`, `image_url` (optional). |
| PUT | `/api/events/:id` | Update event. Body: any subset of fields. |
| DELETE | `/api/events/:id` | Delete event. |

---

## Products

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (in stock only by default). Query: `include_out_of_stock=true`, `category`, `search`. |
| GET | `/api/products/:id` | Get one product by id. |
| POST | `/api/products` | Create product. Body: `name`, `description`, `price` (required); `category`, `stock_quantity`, `sku`, `image_url`, `sustainability_rating` 1–5 (optional). |
| PUT | `/api/products/:id` | Update product. Body: any subset of fields. |
| DELETE | `/api/products/:id` | Delete product. |

---

## Bookings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bookings` | List bookings. Query: `user_id` (required). |
| POST | `/api/bookings` | Create booking. Body: `user_id`, `booking_date` (required); `workshop_id` or `event_id` (one required); `participants`, `status`, `special_requirements` (optional). |

---

## Validation & Errors

- **POST/PUT:** Required fields and types are validated (e.g. `date` as ISO date, `price` ≥ 0). Invalid input returns **400** with `message` describing the error.
- **Not found:** Missing resource returns **404** with `message`.
- **Server error:** Unhandled errors return **500** with `message`.

All database access uses parameterized queries. String inputs are trimmed and validated via express-validator.
