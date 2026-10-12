# UML Class Diagram
## Restaurant Table Reservation System

---

## 1. Class Diagram Overview
The class diagram visualizes the entity domain model, encapsulation of business attributes, relationships, multiplicity constraints, and core behavioral methods across the Spring Boot backend architecture.

---

## 2. Mermaid UML Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        -Long id
        -String name
        -String email
        -String passwordHash
        -Role role
        -LocalDateTime createdAt
        +getId() Long
        +getEmail() String
        +getRole() Role
        +setPasswordHash(String hash) void
    }

    class Role {
        <<enumeration>>
        ROLE_USER
        ROLE_ADMIN
    }

    class Resource {
        -Long id
        -String resourceCode
        -String displayName
        -String category
        -String description
        -Integer seatingCapacity
        -BigDecimal currentRate
        -Integer availableQuantity
        -Boolean active
        -String imageUrl
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
        +getId() Long
        +getResourceCode() String
        +getCurrentRate() BigDecimal
        +getAvailableQuantity() Integer
        +setAvailableQuantity(Integer qty) void
    }

    class Reservation {
        -Long id
        -String uniqueBookingReference
        -User user
        -String customerName
        -String customerPhone
        -LocalDate bookingDate
        -String diningSlot
        -String specialRequests
        -ReservationStatus status
        -BigDecimal baseAmount
        -BigDecimal bookingCharge
        -BigDecimal grandTotal
        -List~ReservationItem~ items
        -List~BookingStatusHistory~ statusHistory
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
        +addItem(ReservationItem item) void
        +addStatusHistory(BookingStatusHistory h) void
        +getStatus() ReservationStatus
        +setStatus(ReservationStatus s) void
    }

    class ReservationStatus {
        <<enumeration>>
        CONFIRMED
        CHECKED_IN
        COMPLETED
        CANCELLED
        +canAdminTransitionTo(ReservationStatus target) boolean
        +canBeCancelled() boolean
    }

    class ReservationItem {
        -Long id
        -Reservation reservation
        -Resource resource
        -Integer quantity
        -BigDecimal savedUnitRate
        -BigDecimal savedBaseAmount
        +getQuantity() Integer
        +getSavedUnitRate() BigDecimal
        +getSavedBaseAmount() BigDecimal
    }

    class BookingStatusHistory {
        -Long id
        -Reservation reservation
        -String previousStatus
        -String newStatus
        -String changedBy
        -LocalDateTime changedAt
        -String remarks
        +getPreviousStatus() String
        +getNewStatus() String
        +getChangedBy() String
    }

    class FareCalculationService {
        <<Service>>
        +calculateBaseAmount(BigDecimal rate, int qty) BigDecimal
        +calculateBookingCharge(BigDecimal baseAmount) BigDecimal
        +calculateGrandTotal(BigDecimal base, BigDecimal charge) BigDecimal
    }

    class ReservationService {
        <<Service>>
        +createReservation(String email, ReservationRequest req) ReservationResponse
        +cancelReservation(String email, Long id, String reason) ReservationResponse
        +updateReservationStatus(String email, Long id, StatusUpdateRequest req) ReservationResponse
        +getUserReservations(String email) List~ReservationResponse~
        +getAdminDashboardStats() AdminDashboardStatsResponse
    }

    %% Relationships
    User "1" --> "1" Role : has role
    User "1" -- "0..*" Reservation : creates >
    Reservation "1" *-- "1..*" ReservationItem : contains
    Reservation "1" *-- "1..*" BookingStatusHistory : audits
    Reservation "1" --> "1" ReservationStatus : current state
    ReservationItem "0..*" --> "1" Resource : references
    ReservationService ..> Reservation : manages
    ReservationService ..> FareCalculationService : uses for pricing
```

---

## 3. Multiplicities and Constraints
1. **User to Reservation (`1 : 0..*`):** A user can make zero or many reservations; every reservation belongs to exactly one user.
2. **Reservation to ReservationItem (`1 : 1..*`):** A reservation contains at least one line item capturing the specific table resource and rate snapshot.
3. **Reservation to BookingStatusHistory (`1 : 1..*`):** Every reservation has at least one status history record created at confirmation, plus additional entries for each lifecycle transition.
4. **ReservationItem to Resource (`* : 1`):** Many reservation items can reference the same catalog table resource over time. The item stores a decoupled snapshot of the rate (`savedUnitRate`), ensuring historical immutability.
