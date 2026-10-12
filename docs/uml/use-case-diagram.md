# UML Use Case Diagram
## Restaurant Table Reservation System

---

## 1. System Boundary & Actor Description
- **Guest / Unregistered Customer:** Browses tables, views live availability, and calculates live fares.
- **Registered Customer (User):** Performs reservations, views personal bookings, inspects immutable fare receipts, and cancels eligible confirmed reservations.
- **Administrator:** Inspects all restaurant reservations, manages table catalog rates & capacities, and advances operational statuses through the strict sequence `CONFIRMED → CHECKED_IN → COMPLETED`.

---

## 2. Mermaid UML Use Case Diagram

```mermaid
flowchart LR
    %% Actors
    Guest(["Guest / Visitor"]):::actorClass
    User(["Registered Customer"]):::actorClass
    Admin(["Restaurant Administrator"]):::actorClass

    %% System Boundary
    subgraph SystemBoundary ["Restaurant Table Reservation System Boundary"]
        UC1(["Browse Tables & Live Availability"]):::ucClass
        UC2(["Calculate Live Fare Breakdown"]):::ucClass
        UC3(["Register & Sign In"]):::ucClass
        
        UC4(["Select Table & Enter Details"]):::ucClass
        UC5(["Atomic Reservation Confirmation"]):::ucClass
        UC6(["View My Reservations"]):::ucClass
        UC7(["Cancel Confirmed Reservation"]):::ucClass
        
        UC8(["View Admin Analytics & KPIs"]):::ucClass
        UC9(["Inspect All Bookings"]):::ucClass
        UC10(["Advance Status: CONFIRMED to CHECKED_IN"]):::ucClass
        UC11(["Advance Status: CHECKED_IN to COMPLETED"]):::ucClass
        UC12(["Manage Table Catalog & Rates"]):::ucClass
    end

    %% Guest Interactions
    Guest --> UC1
    Guest --> UC2
    Guest --> UC3

    %% User Inherits / Interacts
    User --> UC1
    User --> UC2
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7

    %% Admin Interactions
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12

    %% Includes & Extends
    UC5 -.->|includes| UC2
    UC7 -.->|restores capacity| UC12

    classDef actorClass fill:#EBDDC9,stroke:#9A3A1E,stroke-width:2px,color:#1C1917,font-weight:bold;
    classDef ucClass fill:#FDFBF7,stroke:#B84A28,stroke-width:1.5px,color:#1C1917;
```

---

## 3. Use Case Specifications Summary

| Use Case ID | Name | Primary Actor | Preconditions | Postconditions |
| :--- | :--- | :--- | :--- | :--- |
| **UC-01** | Browse Tables | Guest / User | System running | Active tables with remaining capacity displayed |
| **UC-02** | Calculate Fare | Guest / User | Table selected, quantity 1–5 | Base amount, booking charge (₹50/₹0), grand total returned |
| **UC-03** | Authenticate | Guest | Valid email & password | JWT token issued, user state loaded |
| **UC-05** | Confirm Reservation | User | User logged in, inventory > 0 | Atomic booking created, inventory reduced, rate snapshotted |
| **UC-07** | Cancel Booking | User | Booking in `CONFIRMED` status | Status set to `CANCELLED`, table capacity restored exactly once |
| **UC-10/11** | Advance Operational Status | Admin | Booking in preceding state | Advanced to next state (`CHECKED_IN` or `COMPLETED`) with audit log |
| **UC-12** | Manage Table Catalog | Admin | Admin authenticated | Table current rate or available quantity modified |
