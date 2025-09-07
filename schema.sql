-- Run from terminal using
-- `psql -d database_name -f schema.sql`

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS airlines CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE airports (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL
);

CREATE TABLE airlines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  origin_id INT NOT NULL,
  dest_id INT NOT NULL,
  duration INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  airline_id INT NOT NULL,

  CONSTRAINT fk_origin FOREIGN KEY (origin_id) REFERENCES airports(id) ON DELETE CASCADE,
  CONSTRAINT fk_destination FOREIGN KEY (dest_id) REFERENCES airports(id) ON DELETE CASCADE,
  CONSTRAINT fk_airline FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
  CONSTRAINT chk_different_airports CHECK (origin_id <> dest_id),
  CONSTRAINT chk_duration_positive CHECK (duration > 0),
  CONSTRAINT chk_price_positive CHECK (price > 0)
);

CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  route_id INT NOT NULL,
  departure_time INT NOT NULL,
  arrival_time INT NOT NULL,

  CONSTRAINT fk_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Useful indexes
CREATE INDEX idx_routes_airline ON routes(airline_id);
CREATE INDEX idx_routes_origin ON routes(origin_id);
CREATE INDEX idx_routes_destination ON routes(dest_id);
