-- SQLite schema for Urban Harvest Hub (Task 2)

CREATE TABLE IF NOT EXISTS workshops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_hours REAL DEFAULT 2.0,
  price REAL NOT NULL,
  category TEXT,
  max_participants INTEGER DEFAULT 20,
  current_participants INTEGER DEFAULT 0,
  location TEXT,
  instructor_name TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT,
  organizer TEXT,
  image_url TEXT,
  is_free INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  image_url TEXT,
  sustainability_rating INTEGER CHECK(sustainability_rating BETWEEN 1 AND 5),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  workshop_id INTEGER,
  event_id INTEGER,
  booking_date TEXT NOT NULL,
  participants INTEGER DEFAULT 1,
  total_amount REAL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
  special_requirements TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
