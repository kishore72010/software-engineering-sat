# System Architecture Documentation
## Restaurant Table Reservation System

---

## 1. Architectural Overview
The Restaurant Table Reservation System implements a modern, decoupled **Three-Tier Architecture**:
1. **Presentation Layer (Client):** Single Page Application (SPA) built with React, Vite, TypeScript, and Tailwind CSS.
2. **Application / Business Logic Layer (Server):** Spring Boot 3 RESTful web service running on Java 17.
3. **Data Layer (Persistence):** MySQL 8 Relational Database Management System with InnoDB engine.

```
+-------------------------------------------------------+
|                    Client Tier                        |
|  React 19 + TypeScript + Vite + Tailwind CSS (SPA)    |
|   (Public Landing, Catalog, Stepper, Dashboards)      |
+-------------------------------------------------------+
                           |
                     HTTPS / JSON REST
                           v
+-------------------------------------------------------+
|                   Application Tier                    |
|             Spring Boot 3 (Java 17 LTS)               |
|                                                       |
|   [ Controllers ] <---> [ Services ] <---> [ Repos ]  |
|          |                     |                      |
|   [ Security / JWT ]    [ Fare Rules ]                |
|   [ Global Advice ]     [ Concurrency Lock ]          |
+-------------------------------------------------------+
                           |
                      JDBC / HikariCP
                           v
+-------------------------------------------------------+
|                    Database Tier                      |
|                   MySQL 8.0 (InnoDB)                  |
|    users | resources | reservations | items | history |
+-------------------------------------------------------+
```

---

## 2. Backend Layer Breakdown

### A. Presentation / Controller Layer
- Exposes versioned RESTful JSON endpoints.
- Validates request payloads using Jakarta Bean Validation (`@Valid`).
- Uses Data Transfer Objects (DTOs) rather than exposing JPA entities to prevent over-posting and circular references.

### B. Business Service Layer
- **`AuthService`**: Handles BCrypt credential validation, user registration, and issuance of HMAC-SHA256 JWT tokens.
- **`ResourceService`**: Provides catalog queries and real-time fare calculation via `FareCalculationService`.
- **`ReservationService`**: Orchestrates atomic reservation creation, cancellation with single capacity restoration, and administrative status progression.
- **`FareCalculationService`**: Enforces rule BR4 (base amount, threshold check at ₹1000, booking charge calculation).

### C. Data Access / Repository Layer
- Spring Data JPA repositories with custom derived and JPQL queries.
- Implements **Pessimistic Write Locking** (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) on `ResourceRepository` during reservation confirmations and cancellations to guarantee zero race-condition overselling.

---

## 3. Security Architecture
- **Stateless Authentication:** Every authenticated request supplies `Authorization: Bearer <jwt_token>`.
- **Password Hashing:** Passwords hashed with BCrypt (10 rounds). Raw passwords are never persisted or logged.
- **Role-Based Access Control (RBAC):**
  - `ROLE_USER`: Can access own reservations, create bookings, and cancel confirmed bookings.
  - `ROLE_ADMIN`: Can access administrative console, inspect all bookings, advance operational statuses, and modify table catalogs.
- **Centralized Exception Handling:** `GlobalExceptionHandler` converts exceptions into standard `ErrorResponse` objects, suppressing internal database errors and stack traces.

---

## 4. Transaction Boundaries & Concurrency Control
- All mutating business workflows are annotated with `@Transactional`.
- When confirming a booking:
  1. A pessimistic row lock is obtained on the resource row (`SELECT ... FOR UPDATE`).
  2. Availability is checked.
  3. Inventory is decremented.
  4. Reservation record with rate snapshot item is persisted.
  5. Status history is logged.
  If any step throws an exception, Spring's transaction manager triggers a full rollback.
