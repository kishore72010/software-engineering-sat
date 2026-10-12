-- ========================================================================
-- RESTAURANT TABLE RESERVATION SYSTEM
-- Seed Data Script
-- Demonstrates required initial resources R101 - R105 and default users
-- ========================================================================

USE restaurant_reservation_db;

-- 1. SEED DEFAULT USERS
-- Passwords:
-- Admin: Admin@123 -> $2a$10$w17eD8E3c4iQ9O2B7yO3s.R2K3xP3KqY3jZ3sQ5t6w7r8t9u0v1w2 (BCrypt hash)
-- User:  User@123  -> $2a$10$y61uV1T3b6eK7M1A5xN2r.Q1J2wO2JpX2iY2rP4s5v6q7s8t9u0v1 (BCrypt hash)
-- Note: Spring Boot DataInitializer also ensures these users exist with BCryptPasswordEncoder.

INSERT INTO users (id, name, email, password_hash, role, created_at)
VALUES 
  (1, 'Administrator', 'admin@restaurant.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_ADMIN', NOW()),
  (2, 'Aarav Sharma', 'user@restaurant.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ROLE_USER', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED REQUIRED INITIAL RESOURCES (R101 - R105)
-- Requirements:
-- R101 | Table A | ₹499  | 10
-- R102 | Table B | ₹799  | 5
-- R103 | Table C | ₹199  | 20
-- R104 | Table D | ₹1299 | 0
-- R105 | Table E | ₹1000 | 3

INSERT INTO resources (resource_code, display_name, category, description, seating_capacity, current_rate, available_quantity, active, image_url)
VALUES
  ('R101', 'Table A', 'Fine Dining Booth', 'Luxurious velvet booth suited for intimate fine dining and business discussions.', 4, 499.00, 10, TRUE, 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'),
  ('R102', 'Table B', 'Window Panoramic View', 'Spectacular panoramic city skyline views with sunset ambient lighting.', 4, 799.00, 5, TRUE, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'),
  ('R103', 'Table C', 'Casual Garden Terrace', 'Refreshing open-air terrace seating surrounded by lush vertical botanical flora.', 2, 199.00, 20, TRUE, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'),
  ('R104', 'Table D', 'Private Wine Cellar Suite', 'Exclusive acoustic-treated wine cellar alcove with private sommelier service.', 6, 1299.00, 0, TRUE, 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80'),
  ('R105', 'Table E', 'Chef\'s Culinary Counter', 'Direct front-row seating watching the Master Chef craft gastronomic degustation dishes.', 2, 1000.00, 3, TRUE, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE 
  display_name=VALUES(display_name),
  category=VALUES(category),
  current_rate=VALUES(current_rate);
