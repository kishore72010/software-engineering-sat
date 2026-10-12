# L'Aura — Restaurant Table Reservation System
### Production-Grade Full-Stack Web Application for College Software Engineering Practical & Live Demonstration

---

## 1. Project Overview
**L'Aura** is an enterprise-grade Restaurant Table Reservation System designed to provide a seamless, elegant fine-dining booking experience while upholding strict transactional integrity, concurrency-safe capacity allocation, immutable fare snapshots, and role-based operational management.

### Key Highlights
- **Real-Time Inventory & Concurrency Protection:** Employs row-level pessimistic locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) to eliminate seat overselling or double-booking during concurrent reservations.
- **Rule BR4 Compliant Fare Engine:** Dynamically calculates base amount (`unit_rate × quantity`), applies booking fee rules (₹50 if base < ₹1000, waived to ₹0 if base ≥ ₹1000), and validates totals on the backend.
- **Immutable Historical Snapshots (BR3):** Decouples reservation line items from catalog rates, guaranteeing past reservations never change if table catalog rates are modified.
- **Strict Operational Progression (BR8):** Administrators advance reservations only through the sequence: `CONFIRMED → CHECKED_IN → COMPLETED`. Skips and arbitrary state transitions are rejected.
- **Single-Restoration Cancellation (BR9):** Customers may cancel only `CONFIRMED` bookings. Reserved capacity is restored to the table inventory exactly once, preventing double restoration.
- **Full Verification Suite (T1 – T12):** 23 automated tests (JUnit 5, Mockito, Spring Boot Integration) with 100% pass rate.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS v4 with custom warm ivory, charcoal, and terracotta design tokens
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios with JWT request & response interceptors
- **Icons:** Lucide React
- **Analytics:** Recharts

### Backend
- **Language & Runtime:** Java 17 LTS
- **Framework:** Spring Boot 3.2.5
- **Security:** Spring Security 6 with stateless HMAC-SHA256 JWT & BCrypt password hashing
- **Persistence:** Spring Data JPA / Hibernate 6 with HikariCP
- **Validation:** Jakarta Bean Validation (Hibernate Validator)
- **Build System:** Apache Maven 3.9+

### Database
- **Engine:** MySQL 8.0 (InnoDB)
- **Features:** Relational integrity, foreign keys with cascade/restrict rules, custom check constraints, and B-Tree indexes.

---

## 3. Demonstration Credentials

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@restaurant.com` | `Admin@123` | Master reservation controls, status progression, catalog rate/quantity updates, analytics |
| **Customer** | `user@restaurant.com` | `User@123` | Booking creation, personal booking history, receipt viewing, cancellation |

*Note: The login page includes 1-click **Quick Demonstration Credentials** buttons for instant grading without manual typing!*

---

## 4. Benchmark Resources Catalog (Section 3.D)

| Resource ID | Table Name | Category | Rate (₹) | Initial Available Capacity |
| :---: | :---: | :---: | :---: | :---: |
| **R101** | Table A | Fine Dining Booth | ₹499.00 | 10 |
| **R102** | Table B | Window Panoramic View | ₹799.00 | 5 |
| **R103** | Table C | Casual Garden Terrace | ₹199.00 | 20 |
| **R104** | Table D | Private Wine Cellar Suite | ₹1299.00 | 0 *(Sold Out Demo)* |
| **R105** | Table E | Chef's Culinary Counter | ₹1000.00 | 3 |

---

## 5. System Prerequisites
Before running the application, ensure your workstation has:
1. **Java Development Kit (JDK):** Version 17 LTS (`java -version`)
2. **Apache Maven:** Version 3.8+ (`mvn -version`)
3. **Node.js:** Version 18+ or 20+ (`node -v`)
4. **MySQL Server:** Version 8.0+ running on port `3306` (`mysql -version`)

---

## 6. Installation and Setup Guide

### Step 1: Database Initialization
1. Ensure your local MySQL service is running.
2. Open a terminal or MySQL Workbench and execute the schema and seed scripts:
```bash
# Using MySQL Command Line Client:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
*Target Database:* `restaurant_reservation_db`

### Step 2: Configure Backend Connection
Open `backend/src/main/resources/application.properties` and verify your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_reservation_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=kishore98421
server.port=8080
```

### Step 3: Run the Backend Server
In a terminal, navigate to the `backend` folder:
```bash
cd backend
mvn spring-boot:run
```
The Spring Boot backend will start on: **`http://localhost:8080`**

### Step 4: Run the Frontend Application
In a separate terminal, navigate to the `frontend` folder:
```bash
cd frontend
npm run dev
```
The Vite development server will start on: **`http://localhost:5173`**

---

## 7. Automated Testing Execution (T1 – T12)
All 12 mandatory test scenarios are implemented as automated test suites.

To execute all tests:
```bash
cd backend
mvn test
```

### Test Suite Execution Summary
```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.restaurant.reservation.service.FareCalculationServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.restaurant.reservation.service.QuantityValidationTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.restaurant.reservation.service.ReservationBusinessRulesTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.restaurant.reservation.ReservationIntegrationTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] Tests run: 23, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 8. REST API Endpoints Reference

### Authentication Endpoints
- `POST /api/auth/register` — Register a new customer account
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Dining Resources Catalog
- `GET /api/resources` — List all active tables with real-time availability
- `GET /api/resources/{id}` — Get single table resource details
- `POST /api/resources/calculate-fare` — Compute live fare breakdown (base amount + booking charge)
- `PUT /api/resources/{id}` — Update rate or capacity (*Admin Only*)

### Reservations
- `POST /api/reservations` — Atomic reservation confirmation (*Authenticated*)
- `GET /api/reservations/my` — Get user's own reservations (*Authenticated*)
- `GET /api/reservations/{id}` — Get details and rate snapshot (*Owner or Admin*)
- `POST /api/reservations/{id}/cancel` — Cancel eligible `CONFIRMED` booking (*Owner or Admin*)

### Administrative Operations
- `GET /api/admin/reservations` — Retrieve all master reservation records (*Admin Only*)
- `GET /api/admin/stats` — Retrieve KPI metrics and revenue summaries (*Admin Only*)
- `GET /api/admin/resources` — Retrieve complete inventory catalog (*Admin Only*)
- `PATCH /api/admin/reservations/{id}/status` — Advance operational stage (`CONFIRMED → CHECKED_IN → COMPLETED`) (*Admin Only*)

---

## 9. Deliverables and Documentation Directory

```
├── backend/                  # Spring Boot 3 Java 17 application
├── frontend/                 # React 19 Vite TypeScript frontend
├── database/
│   ├── schema.sql            # DDL MySQL 8 table definitions
│   └── seed.sql              # Initial demonstration data & accounts
├── docs/
│   ├── requirements.md       # FR1-FR10 and BR1-BR10 mapping
│   ├── architecture.md       # Layered architecture & security
│   ├── database-schema.md    # Normalized schema specifications
│   ├── test-plan.md          # Comprehensive software test plan
│   ├── test-execution-report.md # Execution checklist for T1 to T12
│   ├── defect-log.md         # Defect tracking record
│   ├── ai-development-report.md # AI development report & verification
│   └── uml/
│       ├── use-case-diagram.md  # UML Use Case Diagram in Mermaid
│       └── class-diagram.md     # UML Class Diagram in Mermaid
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusions
└── README.md                 # Complete system guide
```
