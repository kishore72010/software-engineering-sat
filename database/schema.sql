-- ========================================================================
-- RESTAURANT TABLE RESERVATION SYSTEM
-- Database Schema Definition (MySQL 8.0+)
-- Target Database: restaurant_reservation_db
-- ========================================================================

CREATE DATABASE IF NOT EXISTS restaurant_reservation_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurant_reservation_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN'))
) ENGINE=InnoDB;

CREATE INDEX idx_users_email ON users(email);

-- 2. RESOURCES TABLE (Tables / Reservable Dining Spaces)
CREATE TABLE IF NOT EXISTS resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resource_code VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    seating_capacity INT NOT NULL DEFAULT 4,
    current_rate DECIMAL(10, 2) NOT NULL,
    available_quantity INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_current_rate CHECK (current_rate >= 0),
    CONSTRAINT chk_available_quantity CHECK (available_quantity >= 0)
) ENGINE=InnoDB;

CREATE INDEX idx_resources_code ON resources(resource_code);
CREATE INDEX idx_resources_active ON resources(active);
CREATE INDEX idx_resources_category ON resources(category);

-- 3. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    unique_booking_reference VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(10) NOT NULL,
    booking_date DATE NOT NULL,
    dining_slot VARCHAR(50) NOT NULL DEFAULT 'Dinner (19:30 - 21:30)',
    special_requests TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    base_amount DECIMAL(10, 2) NOT NULL,
    booking_charge DECIMAL(10, 2) NOT NULL,
    grand_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_reservation_status CHECK (status IN ('CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_phone_digits CHECK (LENGTH(customer_phone) = 10 AND customer_phone REGEXP '^[0-9]+$')
) ENGINE=InnoDB;

CREATE INDEX idx_reservations_ref ON reservations(unique_booking_reference);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_date ON reservations(booking_date);

-- 4. RESERVATION ITEMS TABLE (Line Items with Snapshot of Unit Rate and Base Amount)
CREATE TABLE IF NOT EXISTS reservation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    saved_unit_rate DECIMAL(10, 2) NOT NULL,
    saved_base_amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_res_item_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_item_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE RESTRICT,
    CONSTRAINT chk_item_quantity CHECK (quantity BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE INDEX idx_items_reservation ON reservation_items(reservation_id);
CREATE INDEX idx_items_resource ON reservation_items(resource_id);

-- 5. BOOKING STATUS HISTORY (Audit Trail of All Status Changes)
CREATE TABLE IF NOT EXISTS booking_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255),
    CONSTRAINT fk_status_hist_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_hist_reservation ON booking_status_history(reservation_id);
