# How to Run Urban Harvest Hub

This project requires running both the **REST API (Backend)** and the **Frontend (Client)**.

## 1. Prerequisites
- **Node.js** v18+
- **MySQL Server**

## 2. Database Setup (MySQL)
1. Create a database named `urban_harvest_hub` in your MySQL server.
2. In `Task_2/server/`, create a `.env` file from `.env.example` and update your database credentials (`MYSQL_USER`, `MYSQL_PASSWORD`, etc.).
3. Run the following in `Task_2/server/`:
   ```bash
   npm install
   npm run init-db
   npm run seed
   ```

## 3. Running the App
- **Backend:** In `Task_2/server/`, run `npm run dev`.
- **Frontend:** In `Task_1/client/`, run `npm install` then `npm run dev`.

## 4. Testing
- **API:** Test endpoints like `GET /api/workshops` using Postman or a browser.
- **GUI:** Open `http://localhost:5173` and test navigation, search, and booking features.
- **PWA:** Open DevTools > Application > Service Workers to verify the PWA is active.

Refer to the root **README.md** for more detailed instructions.
