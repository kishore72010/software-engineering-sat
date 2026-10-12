# Comprehensive Software Test Plan
## Restaurant Table Reservation System

---

## 1. Objectives & Scope
The test plan ensures all Functional Requirements (FR1–FR10) and Business Rules (BR1–BR10) are validated across both automated test suites and manual validation procedures. Special focus is placed on transactional boundaries, concurrency safety, fare computation accuracy, access isolation, and status progression integrity.

---

## 2. Test Strategy & Levels
1. **Unit Testing:**
   - Isolated logic testing with JUnit 5 & Mockito.
   - Target: `FareCalculationService`, `ReservationBusinessRulesTest`, `QuantityValidationTest`.
2. **Integration Testing:**
   - Spring Boot web and database integration testing with `@SpringBootTest` and MockMvc.
   - Target: `ReservationIntegrationTest`, JWT authentication, transactional integrity.
3. **End-to-End & UI Verification:**
   - React components, multi-step booking stepper, live fare calculations, table availability state changes.
4. **Mandatory Test Suite (T1 – T12):**
   - Verification of the 12 critical scenarios specified in the project requirements.

---

## 3. Test Suite Matrix (T1 – T12)

| Test ID | Test Scenario | Linked FR / BR | Test Type |
| :--- | :--- | :--- | :--- |
| **T1** | Duplicate Resource Selection | FR2, BR1, BR6 | Automated Unit Test |
| **T2** | Quantity Validation (0, 1, 5, 6, 1.5) | FR2, BR1 | Automated Unit & Bean Validation |
| **T3** | Unavailable Resource (R104 with 0 availability) | FR1, FR4, BR2, BR6 | Automated Unit Test |
| **T4** | Fare Calculation (₹999, ₹1000, ₹1001) | FR3, BR4 | Automated Service Test |
| **T5** | Valid Reservation Confirmation | FR4, FR5, BR3, BR7 | Automated Integration Test |
| **T6** | Missing/Invalid Guest Details | FR4, BR5, BR6 | Automated Validation Test |
| **T7** | Availability Revalidation (Stale State) | FR4, BR2, BR6 | Automated Service Test |
| **T8** | Access Control & Ownership Isolation | FR6, FR7, BR10 | Automated Security Test |
| **T9** | Operational Status Lifecycle Progression | FR7, BR8 | Automated Service Test |
| **T10** | Single-Restoration Cancellation | FR8, BR8, BR9 | Automated Service Test |
| **T11** | Application Persistence Across Restart | FR10 | Automated Spring Boot Test |
| **T12** | Rate Snapshot Immutability | FR5, BR3 | Automated Service Test |
