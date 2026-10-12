# Database Schema Documentation
## Restaurant Table Reservation System (MySQL 8.0)

**Target Database:** `restaurant_reservation_db`  
**Storage Engine:** InnoDB  
**Character Set:** `utf8mb4`  
**Collation:** `utf8mb4_unicode_ci`  

---

## 1. Entity-Relationship Overview

```
 [users] 1 --------< N [reservations] 1 --------< N [reservation_items] >-------- 1 [resources]
                                |
                                +---------< N [booking_status_history]
```

---

## 2. Table Specifications

### 1. `users`
Persists system accounts for both guests and administrators.

| Column | Type | Nullable | Key / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(100) | NO | | Customer or admin full name |
| `email` | VARCHAR(120) | NO | UNIQUE | User login email address |
| `password_hash` | VARCHAR(255) | NO | | BCrypt encrypted hash |
| `role` | VARCHAR(20) | NO | CHECK (`ROLE_USER`, `ROLE_ADMIN`) | Authorization role |
| `created_at` | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

---

### 2. `resources`
Represents reservable dining spaces (tables, booths, private suites).

| Column | Type | Nullable | Key / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | Unique resource ID |
| `resource_code` | VARCHAR(30) | NO | UNIQUE | Identification code (e.g. `R101`) |
| `display_name` | VARCHAR(100) | NO | | Public display title (e.g. `Table A`) |
| `category` | VARCHAR(50) | NO | | Dining ambience category |
| `description` | TEXT | YES | | Detailed dining description |
| `seating_capacity` | INT | NO | DEFAULT 4 | Maximum guests seated |
| `current_rate` | DECIMAL(10,2)| NO | CHECK (`current_rate >= 0`) | Current per-unit rate in ₹ |
| `available_quantity`| INT | NO | CHECK (`available_quantity >= 0`) | Available reservable units |
| `active` | BOOLEAN | NO | DEFAULT TRUE | Active listing flag |
| `image_url` | VARCHAR(255) | YES | | Curated dining atmosphere photo |
| `created_at` | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Created timestamp |
| `updated_at` | TIMESTAMP | NO | ON UPDATE CURRENT_TIMESTAMP | Last modified timestamp |

---

### 3. `reservations`
Master booking records for confirmed and tracked reservations.

| Column | Type | Nullable | Key / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | Reservation identifier |
| `unique_booking_reference`| VARCHAR(50) | NO | UNIQUE | Unique alphanumeric reference (e.g. `RES-20261012-78A3`) |
| `user_id` | BIGINT | NO | FOREIGN KEY -> `users(id)` | Associated user account |
| `customer_name` | VARCHAR(100) | NO | | Guest name on reservation |
| `customer_phone` | VARCHAR(10) | NO | CHECK (10 numeric digits) | Guest mobile phone |
| `booking_date` | DATE | NO | | Scheduled reservation date |
| `dining_slot` | VARCHAR(50) | NO | | Dining time slot |
| `special_requests`| TEXT | YES | | Guest preferences / allergies |
| `status` | VARCHAR(30) | NO | CHECK (`CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`) | Lifecycle status |
| `base_amount` | DECIMAL(10,2)| NO | | Base amount snapshot (`unit_rate × qty`) |
| `booking_charge` | DECIMAL(10,2)| NO | | Booking fee (₹50 or ₹0) |
| `grand_total` | DECIMAL(10,2)| NO | | Final total in ₹ |
| `created_at` | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Confirmation timestamp |
| `updated_at` | TIMESTAMP | NO | ON UPDATE CURRENT_TIMESTAMP | Status update timestamp |

---

### 4. `reservation_items`
Individual line items capturing rate snapshots at booking confirmation.

| Column | Type | Nullable | Key / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | Line item ID |
| `reservation_id` | BIGINT | NO | FOREIGN KEY -> `reservations(id)` ON DELETE CASCADE | Parent reservation reference |
| `resource_id` | BIGINT | NO | FOREIGN KEY -> `resources(id)` | Associated table resource |
| `quantity` | INT | NO | CHECK (`quantity BETWEEN 1 AND 5`) | Reserved table units |
| `saved_unit_rate` | DECIMAL(10,2)| NO | | **Unit rate snapshot** at booking time |
| `saved_base_amount`| DECIMAL(10,2)| NO | | **Base amount snapshot** |

---

### 5. `booking_status_history`
Full audit trail of all operational state transitions.

| Column | Type | Nullable | Key / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | NO | PRIMARY KEY, AUTO_INCREMENT | History log entry ID |
| `reservation_id` | BIGINT | NO | FOREIGN KEY -> `reservations(id)` ON DELETE CASCADE | Target reservation reference |
| `previous_status` | VARCHAR(30) | YES | | Status prior to transition |
| `new_status` | VARCHAR(30) | NO | | Target status |
| `changed_by` | VARCHAR(100) | NO | | Actor email initiating transition |
| `changed_at` | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Timestamp of transition |
| `remarks` | VARCHAR(255) | YES | | Audit note / reason for update |
