# Urban Harvest Hub - Full Stack PWA

This project is a community-driven platform for eco-conscious living, featuring workshops, events, and sustainable products. It is built as a Progressive Web App (PWA) with a React frontend and an Express/MySQL backend.

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Testing the Application](#-testing-the-application)
- [PWA Features](#-pwa-features)

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MySQL Server** (Ensure it is running)

---

## 🗄 Database Setup

The application uses a MySQL database. Follow these steps to set it up:

1.  **Create the Database:**
    Open your MySQL terminal or a tool like phpMyAdmin and run:
    ```sql
    CREATE DATABASE urban_harvest_hub;
    ```

2.  **Configure Environment Variables:**
    - Navigate to `Task_2/server/`.
    - Create a file named `.env` (or copy from `.env.example`).
    - Update the database credentials:
      ```env
      MYSQL_HOST=localhost
      MYSQL_USER=root
      MYSQL_PASSWORD=your_password
      MYSQL_DATABASE=urban_harvest_hub
      JWT_SECRET=your_jwt_secret
      PORT=5000
      ```

3.  **Initialize Schema & Seed Data:**
    In the `Task_2/server` directory, run:
    ```bash
    npm install
    npm run init-db
    npm run seed
    ```
    This will create the necessary tables and populate them with sample data.

---

## 🚀 Running the Application

You need to run both the backend server and the frontend client simultaneously.

### 1. Start the Backend (Task 2)
In a terminal, navigate to the server directory:
```bash
cd Task_2/server
npm run dev
```
The API will be available at `http://localhost:5000`.

### 2. Start the Frontend (Task 1)
In a **new** terminal, navigate to the client directory:
```bash
cd Task_1/client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🧪 Testing the Application

### API Testing (Manual/Postman)
You can test the REST API endpoints using Postman or your browser:
- **Health Check:** `GET http://localhost:5000/api/health`
- **Workshops:** `GET http://localhost:5000/api/workshops`
- **Events:** `GET http://localhost:5000/api/events`
- **Products:** `GET http://localhost:5000/api/products`

### GUI Testing (Frontend)
1.  **Navigation:** Open `http://localhost:5173` and click through the tabs (Workshops, Events, Products).
2.  **Search & Filter:** Use the search bar on the Products page to filter items.
3.  **Detail View:** Click on a workshop or product badge to see the detail page.
4.  **Booking:** Try booking a workshop (ensure the backend is running).
5.  **Responsiveness:** Resize your browser window to test the mobile-friendly layout.

---

## 📱 PWA Features

This application is a fully functional Progressive Web App.
- **Service Worker:** Registered and active (check Chrome DevTools > Application > Service Workers).
- **Manifest:** Configured for high-quality icons and theme colors.
- **Offline Support:** The app caches essential assets and provides an offline fallback.
- **Installability:** Click the "Install" icon in your browser's address bar to install it as a desktop/mobile app.
- **Lighthouse:** Run a Lighthouse audit in Chrome DevTools to verify PWA scores (score ≥ 90 recommended).

---

## 📂 Project Structure
- `Task_1/client/`: React frontend (PWA).
- `Task_2/server/`: Express.js backend (REST API).
- `Task_1/backend/`: (Optional) PHP-based authentication backend.
