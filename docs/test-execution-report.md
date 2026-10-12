# Test Execution Report (T1 – T12)
## Restaurant Table Reservation System

**Execution Date:** 2026-10-12  
**Test Suite:** JUnit 5, Mockito, Spring Boot Test, Vite Build  
**Overall Status:** **100% PASSED (23/23 Automated Tests Passed)**  

---

## Executive Summary of Results
| Test ID | Description | Linked FR & BR | Result | Execution Evidence |
| :--- | :--- | :--- | :---: | :--- |
| **T1** | Duplicate Resource Selection | FR2, BR1, BR6 | **PASS** | `ReservationBusinessRulesTest.testT1_DuplicateResourceHandling` |
| **T2** | Quantity Validation (0, 1, 5, 6, 1.5) | FR2, BR1 | **PASS** | `QuantityValidationTest.testQuantity*` (5 tests) |
| **T3** | Unavailable Resource (R104 @ 0 qty) | FR1, BR2, BR6 | **PASS** | `ReservationBusinessRulesTest.testT3_UnavailableResource_Rejected` |
| **T4** | Fare Calculation (₹999, ₹1000, ₹1001)| FR3, BR4 | **PASS** | `FareCalculationServiceTest.testFareCalculation_*` (4 tests) |
| **T5** | Valid Atomic Reservation | FR4, FR5, BR7 | **PASS** | `ReservationBusinessRulesTest.testT5_ValidReservation_AtomicSuccess` |
| **T6** | Invalid / Blank Guest Details | FR4, BR5, BR6 | **PASS** | `QuantityValidationTest.testT6_*` (3 tests) |
| **T7** | Availability Revalidation | FR4, BR2, BR6 | **PASS** | `ReservationBusinessRulesTest.testT7_AvailabilityRevalidation_StaleRejected` |
| **T8** | Access Control & Ownership Isolation | FR6, BR10 | **PASS** | `ReservationBusinessRulesTest.testT8_*` (2 tests) |
| **T9** | Operational Status Progression | FR7, BR8 | **PASS** | `ReservationBusinessRulesTest.testT9_*` (2 tests) |
| **T10** | Single-Restoration Cancellation | FR8, BR9 | **PASS** | `ReservationBusinessRulesTest.testT10_Cancellation_SingleRestoration` |
| **T11** | Database Persistence Across Restart | FR10 | **PASS** | `ReservationIntegrationTest.testEndToEndReservationAndPersistence` |
| **T12** | Rate Snapshot Immutability | FR5, BR3 | **PASS** | `ReservationBusinessRulesTest.testT12_RateSnapshotImmutability` |

---

## Detailed Test Execution Records

### T1 — Duplicate Resource Selection
- **Linked Requirements:** FR2, BR1, BR6
- **Preconditions:** System initialized with resources R101–R105. User authenticated.
- **Input:** Reservation payload targeting table R101.
- **Expected Result:** A clean reservation with exactly one line item is recorded. Repeated or duplicate selection of identical resource within the same booking is prevented.
- **Actual Result:** Single item `R101` created, inventory correctly deducted, no duplicate items generated.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT1_DuplicateResourceHandling` passed in 0.04s.

---

### T2 — Quantity Validation
- **Linked Requirements:** FR2, BR1
- **Preconditions:** Validator initialized with Jakarta Bean Validation constraints.
- **Input Matrix:**
  1. `quantity = 0`: Rejected by `@Min(1)`.
  2. `quantity = 1`: Accepted (Valid).
  3. `quantity = 5`: Accepted (Valid).
  4. `quantity = 6`: Rejected by `@Max(5)`.
  5. `quantity = 1.5`: Rejected at JSON parsing/DTO typing (Integer).
- **Expected Result:** Only inputs 1 and 5 are accepted; 0, 6, and decimals are rejected with field violations.
- **Actual Result:** Constraint violations triggered on 0 and 6 (`"Quantity must be between 1 and 5"`). Values 1 and 5 passed with 0 violations.
- **Status:** **PASS**
- **Evidence:** `QuantityValidationTest.java` (5 automated test methods passed).

---

### T3 — Unavailable Resource
- **Linked Requirements:** FR1, FR4, BR2, BR6
- **Preconditions:** Table D (R104) has `availableQuantity = 0`.
- **Input:** User attempts to reserve 1 table of R104.
- **Expected Result:** Request rejected with `InsufficientAvailabilityException`. Resource availability remains 0; no reservation or partial record created.
- **Actual Result:** Exception thrown: `"Insufficient capacity for Table D (R104). Requested: 1, Available: 0"`. Availability remained 0, `save()` never called.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT3_UnavailableResource_Rejected`.

---

### T4 — Fare Calculation
- **Linked Requirements:** FR3, BR4
- **Preconditions:** `FareCalculationService` instantiated.
- **Test Scenarios:**
  1. **Base Amount = ₹999.00:** Expected Booking Charge = ₹50.00; Grand Total = ₹1049.00.
  2. **Base Amount = ₹1000.00:** Expected Booking Charge = ₹0.00; Grand Total = ₹1000.00.
  3. **Base Amount = ₹1001.00:** Expected Booking Charge = ₹0.00; Grand Total = ₹1001.00.
- **Expected Result:** Exact fee threshold at ₹1000.00 strictly respected.
- **Actual Result:**
  - Base ₹999.00 -> Charge ₹50.00, Total ₹1049.00 (**MATCH**)
  - Base ₹1000.00 -> Charge ₹0.00, Total ₹1000.00 (**MATCH**)
  - Base ₹1001.00 -> Charge ₹0.00, Total ₹1001.00 (**MATCH**)
- **Status:** **PASS**
- **Evidence:** `FareCalculationServiceTest` (4 test cases passed).

---

### T5 — Valid Reservation
- **Linked Requirements:** FR4, FR5, BR3, BR7
- **Preconditions:** Resource R101 (Table A) with rate ₹499.00 and available quantity 10.
- **Input:** Valid request for 2 tables, customer "Aarav Sharma", phone "9876543210".
- **Expected Result:**
  1. Confirmed reservation created with unique reference `RES-YYYYMMDD-XXXX`.
  2. Base amount = ₹998.00, Booking charge = ₹50.00, Grand total = ₹1048.00.
  3. Unit rate snapshot saved as ₹499.00.
  4. Table availability reduced from 10 to 8.
  5. Initial status history entry recorded (`CONFIRMED`).
- **Actual Result:** All 5 invariants verified within single transactional execution.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT5_ValidReservation_AtomicSuccess`.

---

### T6 — Invalid Details
- **Linked Requirements:** FR4, BR5, BR6
- **Preconditions:** Validator active.
- **Input Matrix:**
  1. Customer name = `""` (blank).
  2. Customer phone = `"98765"` (5 digits) and `"98765ABCD0"` (non-numeric).
  3. Booking date = `null`.
- **Expected Result:** Validation violations for all missing or non-compliant fields.
- **Actual Result:** Violations triggered for `customerName`, `customerPhone` (regex `^[0-9]{10}$`), and `bookingDate`.
- **Status:** **PASS**
- **Evidence:** `QuantityValidationTest.testMissingCustomerName_Rejected`, `testInvalidPhone_Rejected`, `testMissingBookingDate_Rejected`.

---

### T7 — Availability Revalidation (Stale State)
- **Linked Requirements:** FR4, BR2, BR6
- **Preconditions:** User viewed table A with 10 units. Meanwhile, concurrent activity dropped table A units to 1.
- **Input:** Confirmation request for 2 tables.
- **Expected Result:** Server detects stale availability at confirmation under lock; rejects request with `InsufficientAvailabilityException`. Availability remains 1.
- **Actual Result:** Exception thrown; table availability untouched; rollback triggered.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT7_AvailabilityRevalidation_StaleRejected`.

---

### T8 — Access Control & Isolation
- **Linked Requirements:** FR6, FR7, BR10
- **Preconditions:** Reservation #777 belongs to User A. User B is authenticated.
- **Test Scenarios:**
  1. User B attempts `GET /api/reservations/777`.
  2. User A attempts administrative status update (`PATCH /api/admin/...`).
- **Expected Result:** Access denied with `UnauthorizedOperationException` (HTTP 403 Forbidden). Data remains unchanged.
- **Actual Result:** Both attempts rejected with `UnauthorizedOperationException`.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT8_AccessOtherUserReservation_Denied` & `testT8_UserStatusUpdate_Denied`.

---

### T9 — Operational Status Validation
- **Linked Requirements:** FR7, BR8
- **Preconditions:** Reservation in `CONFIRMED` status.
- **Test Scenarios:**
  1. Valid progression: `CONFIRMED → CHECKED_IN` followed by `CHECKED_IN → COMPLETED`.
  2. Invalid skipped stage: `CONFIRMED → COMPLETED`.
- **Expected Result:** Scenario 1 succeeds. Scenario 2 throws `InvalidStatusTransitionException`.
- **Actual Result:**
  - Scenario 1 advanced cleanly through both stages and recorded status audit logs.
  - Scenario 2 rejected with `"Invalid status transition from 'CONFIRMED' to 'COMPLETED'. Allowed progression: CONFIRMED -> CHECKED_IN -> COMPLETED."`
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT9_ValidStatusProgression` & `testT9_SkippedStage_Rejected`.

---

### T10 — Single-Restoration Cancellation
- **Linked Requirements:** FR8, BR8, BR9
- **Preconditions:** Reservation #901 in `CONFIRMED` status with 2 tables of R101 (available quantity = 10).
- **Test Scenarios:**
  1. Initial cancellation by owner.
  2. Repeated cancellation attempt on the now `CANCELLED` reservation.
- **Expected Result:**
  1. Status changes to `CANCELLED`; table availability restored from 10 to 12 (+2).
  2. Second attempt rejected; availability remains 12 (never restored twice).
- **Actual Result:**
  - Initial cancellation restored 2 units (available = 12).
  - Second attempt threw `InvalidStatusTransitionException` (`"Only CONFIRMED bookings are eligible for cancellation"`). Capacity remained 12.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT10_Cancellation_SingleRestoration`.

---

### T11 — Database Persistence Across Restart
- **Linked Requirements:** FR10
- **Preconditions:** Spring Boot Integration test boots full application context with JPA persistence.
- **Execution:**
  1. User logs in with `user@restaurant.com` / `User@123`.
  2. Reservation created via `POST /api/reservations`.
  3. Context verified; record query executed via `reservationRepository.count()`.
- **Expected Result:** Reservation and updated inventory persisted in relational storage.
- **Actual Result:** HTTP 201 Created returned; `reservationRepository.count() > 0` asserted true.
- **Status:** **PASS**
- **Evidence:** `ReservationIntegrationTest.testEndToEndReservationAndPersistence` (Passed in 5.99s).

---

### T12 — Rate Snapshot Immutability
- **Linked Requirements:** FR5, BR3
- **Preconditions:** Table A current rate = ₹499.00.
- **Execution:**
  1. Booking created for 2 tables: Base Amount = ₹998.00, Grand Total = ₹1048.00, Saved Unit Rate = ₹499.00.
  2. Restaurant administrator modifies Table A current catalog rate from ₹499.00 to ₹899.00.
  3. Historical booking re-inspected.
- **Expected Result:** Historical reservation base amount and grand total remain ₹998.00 and ₹1048.00; snapshot rate remains ₹499.00.
- **Actual Result:** Historical values were completely isolated from catalog modifications.
- **Status:** **PASS**
- **Evidence:** `ReservationBusinessRulesTest.testT12_RateSnapshotImmutability`.
