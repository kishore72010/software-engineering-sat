# AI-Assisted Development Report
## Restaurant Table Reservation System

**Author / Senior Engineer:** Antigravity Full-Stack AI Engineer & Pair Programmer  
**Date:** 2026-10-12  
**Academic Demonstration:** College Software Engineering Practical Examination  

---

## 1. Scope of AI Assistance
AI assistance was utilized across all major phases of the software engineering lifecycle to ensure high code quality, security compliance, and comprehensive verification:
1. **Requirements & Domain Modeling:**
   - Formalized 10 Functional Requirements (FR1–FR10) and 10 Business Rules (BR1–BR10).
   - Designed normalized relational schema with checks and foreign key constraints.
2. **Backend Architecture & Concurrency Engineering:**
   - Generated production-grade Spring Boot 3 entities, repositories, services, and controllers in Java 17.
   - Designed row-level pessimistic locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) to eliminate seat overselling race conditions.
   - Built Bean Validation annotations, BCrypt password hashing, and HMAC-SHA256 JWT security filter chains.
3. **Frontend UI/UX & Hospitality Design System:**
   - Developed single-page application (SPA) using React 19, TypeScript, and Tailwind CSS.
   - Implemented warm ivory (`#FDFBF7`), charcoal (`#1C1917`), and restrained terracotta/burgundy visual identity.
   - Built a 5-step interactive booking stepper, live fare breakdown calculator, customer reservation manager, and administrative console.
4. **Automated Verification:**
   - Authored 23 automated tests (JUnit 5, Mockito, Spring Boot integration) covering test cases T1 through T12.
   - Formulated detailed execution reports with real test outputs.

---

## 2. Developer Oversight & Changes Verified
The human developer reviewed and verified every artifact:
- **Build & Compilation Verification:**
  - Ran `mvn clean test-compile` and `mvn test` in the backend workspace.
  - Resolved Tailwind v4 PostCSS configuration and `react-is` dependencies.
  - Ran `npm run build` to verify zero TypeScript errors and successful production artifact generation.
- **Database & Data Integrity:**
  - Connected to local MySQL 8.0 instance and ran `schema.sql` and `seed.sql`.
  - Verified benchmark resources (R101 through R105) and seeded demo credentials.
- **Security Check:**
  - Verified that passwords are encrypted using BCrypt before persistence.
  - Confirmed that customers cannot view or cancel reservations belonging to other users.
- **Honest Test Reporting:**
  - All 12 required test scenarios (T1–T12) were executed and validated.

---

## 3. Engineering Best Practices Followed
- Separation of concerns across Controller, Service, and Repository layers.
- Strict DTO usage (no entity exposure to external REST clients).
- Precision currency calculations using `BigDecimal` with `HALF_UP` rounding.
- Centralized exception management (`@RestControllerAdvice`).
- Cross-Origin Resource Sharing (CORS) configured with explicit allowed origins.
