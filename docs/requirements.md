# Software Requirements Specification (SRS)
## Restaurant Table Reservation System

**Project:** L'Aura Restaurant Table Reservation System  
**Document Version:** 1.0.0  
**Target Audience:** Academic Evaluators, Software Engineers, System Architects  

---

## 1. Executive Summary
The Restaurant Table Reservation System is an enterprise-grade full-stack web application developed for fine dining establishments. It addresses the critical challenges of double-booking, race conditions in seat allocation, stale availability views, unauthorized reservation tampering, and non-transparent fare calculations.

---

## 2. Functional Requirements (FR1 – FR10)

| Requirement ID | Title | Description | Verification Method |
| :--- | :--- | :--- | :--- |
| **FR1** | **Resource Display & Search** | The system displays active dining resources with unique codes (R101–R105), categories, unit rates in Indian Rupees (₹), seating capacities, and remaining availability. Users can search and filter in real-time. | Automated Integration & UI Test |
| **FR2** | **Resource & Quantity Selection** | The customer can select a specific dining resource and choose an integer quantity between 1 and 5. Non-integers or invalid quantities are rejected. | Unit Tests & Bean Validation |
| **FR3** | **Live Fare Calculation** | The application calculates base amounts (`unit_rate × quantity`) and booking charges (₹50 if base < ₹1000, otherwise ₹0) and computes grand totals strictly on the backend. | Automated Service Tests (`FareCalculationServiceTest`) |
| **FR4** | **Guest Validation & Availability Revalidation** | Validates customer name, mandatory 10-digit numeric phone number, future booking date, and revalidates live table availability at final confirmation. | Bean Validation & Service Layer |
| **FR5** | **Atomic Reservation Confirmation** | Within a single database transaction (`@Transactional`), the system generates a unique booking reference, records item rate snapshots, decrements table availability, and saves audit history. | Transactional Integration Test |
| **FR6** | **User Access Isolation** | Authenticated users can view and inspect only their own reservations. Direct access to other customers' booking records is strictly prohibited. | Spring Security & Ownership Check |
| **FR7** | **Strict Administrative Progression** | Administrators can advance bookings only through the valid operational sequence: `CONFIRMED → CHECKED_IN → COMPLETED`. Skipped stages are rejected. | Service Logic & Unit Test T9 |
| **FR8** | **Single-Restoration Cancellation** | Eligible reservations in `CONFIRMED` status can be cancelled. The system restores inventory capacity exactly once, preventing double restoration. | Concurrency Lock & Unit Test T10 |
| **FR9** | **Centralized Error Handling** | Structured HTTP error responses (`ErrorResponse`) are returned for invalid inputs, stale inventory, authentication failures, and authorization denials without exposing raw stack traces. | Global Exception Handler (`@RestControllerAdvice`) |
| **FR10** | **Relational Persistence in MySQL** | All entities (users, resources, reservations, reservation_items, booking_status_history) are persisted in MySQL 8 with relational constraints and foreign keys. | MySQL Schema Verification |

---

## 3. Mandatory Business Rules (BR1 – BR10)

| Rule ID | Name | Rule Specification | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **BR1** | **Quantity Range** | Quantity must be an integer from 1 to 5 inclusive. Inputs of 0, negative values, decimals, or values > 5 are rejected with validation errors. | Jakarta `@Min(1)`, `@Max(5)` and Service Validation |
| **BR2** | **Availability Re-check** | The resource must be active and have sufficient available capacity. The server re-verifies availability at confirmation under row-level pessimistic locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`). | JPA Pessimistic Write Lock |
| **BR3** | **Rate Snapshot Immutability** | At booking confirmation, the system snapshots the current unit rate and base amount into `reservation_items`. Subsequent rate changes in the table catalog do not alter historical booking totals. | Entity Decoupling & Snapshot Fields |
| **BR4** | **Fare Calculation Formula** | 1. `Base Amount = unit_rate × quantity`<br>2. `Booking Charge = ₹50` if `Base Amount < ₹1000`, else `₹0`<br>3. `Grand Total = Base Amount + Booking Charge`<br>All monetary calculations use `BigDecimal` with 2 decimal places (`HALF_UP`). | `FareCalculationService` |
| **BR5** | **Mandatory Field Validation** | Customer name cannot be blank. Customer phone must match regex `^[0-9]{10}$`. Booking date cannot be in the past. Required reference fields (dining slot) must be present. | Bean Validation Annotations |
| **BR6** | **Atomic Rejection** | Any failure (insufficient inventory, validation error, database lock timeout) rejects the request without creating partial records or altering availability. | Spring `@Transactional` Rollback |
| **BR7** | **Atomic Confirmation** | Within one transaction: create reservation, save snapshot item, decrement table availability, and create initial `CONFIRMED` status history entry. | `@Transactional` Boundary |
| **BR8** | **Operational Status Progression** | Allowed admin lifecycle: `CONFIRMED → CHECKED_IN → COMPLETED`. Skipped stages (e.g. `CONFIRMED → COMPLETED`) or backward transitions are forbidden. Cancellation is allowed only from `CONFIRMED`. | `ReservationStatus.canAdminTransitionTo()` |
| **BR9** | **Cancellation & Single Restoration** | Cancelling a `CONFIRMED` reservation transitions status to `CANCELLED` and restores reserved quantity to table availability exactly once. Repeated cancellation attempts are rejected. | Status Verification & Transaction Lock |
| **BR10** | **Multi-Tenant Access Isolation** | Users may view and cancel only their own reservations. Only users with `ROLE_ADMIN` can access administrative dashboards or execute operational status updates. | `@PreAuthorize` & Service Ownership Guard |
