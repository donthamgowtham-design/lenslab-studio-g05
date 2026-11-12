-- LensLab Studio Database Schema
-- Member 2: Database Schema & Relational Tables

PRAGMA foreign_keys = ON;

-- 1. Photographers Table
CREATE TABLE IF NOT EXISTS photographers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT
);

-- 2. Cameras Table (Stores name and kind)
CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    status TEXT DEFAULT 'available'
);

-- 3. Rentals Table (Related to photographers and cameras)
CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photographer_id INTEGER NOT NULL,
    camera_id INTEGER NOT NULL,
    rental_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (photographer_id) REFERENCES photographers(id) ON DELETE CASCADE,
    FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
);
