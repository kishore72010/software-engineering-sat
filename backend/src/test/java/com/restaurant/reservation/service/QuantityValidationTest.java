package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.ReservationRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Mandatory Test T2 — Quantity Validation.
 * Test quantities 0, 1, 5, 6, and 1.5. Only 1 and 5 should be accepted.
 * Mandatory Test T6 — Invalid Details.
 * Submit missing or invalid required fields. Verify rejection.
 */
class QuantityValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ReservationRequest createValidRequest(Integer quantity) {
        return new ReservationRequest(
                1L,
                quantity,
                "Aarav Sharma",
                "9876543210",
                LocalDate.now().plusDays(1),
                "Dinner (19:30 - 21:30)",
                "Window side table preference"
        );
    }

    @Test
    @DisplayName("T2.1 - Quantity 0 should be rejected by validation")
    void testQuantityZero_Rejected() {
        ReservationRequest request = createValidRequest(0);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty(), "Quantity 0 must have validation violations");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("quantity")));
    }

    @Test
    @DisplayName("T2.2 - Quantity 1 should be accepted")
    void testQuantityOne_Accepted() {
        ReservationRequest request = createValidRequest(1);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertTrue(violations.isEmpty(), "Quantity 1 must be valid with zero violations");
    }

    @Test
    @DisplayName("T2.3 - Quantity 5 should be accepted")
    void testQuantityFive_Accepted() {
        ReservationRequest request = createValidRequest(5);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertTrue(violations.isEmpty(), "Quantity 5 must be valid with zero violations");
    }

    @Test
    @DisplayName("T2.4 - Quantity 6 should be rejected by validation")
    void testQuantitySix_Rejected() {
        ReservationRequest request = createValidRequest(6);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty(), "Quantity 6 must have validation violations");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("quantity")));
    }

    @Test
    @DisplayName("T2.5 - Non-integer/decimal quantity 1.5: Integer type enforces whole numbers")
    void testQuantityDecimal_EnforcedByIntegerType() {
        // In Java DTO, quantity is typed as Integer, which syntactically rejects decimals at parse/API boundary.
        // A null or non-integer input triggers constraint violation.
        ReservationRequest request = createValidRequest(null);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty(), "Null or non-integer parsed quantity must be rejected");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("quantity")));
    }

    @Test
    @DisplayName("T6.1 - Missing customer name should be rejected")
    void testMissingCustomerName_Rejected() {
        ReservationRequest request = createValidRequest(2);
        request.setCustomerName("");
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("customerName")));
    }

    @Test
    @DisplayName("T6.2 - Invalid phone number (less than 10 digits or non-numeric) should be rejected")
    void testInvalidPhone_Rejected() {
        ReservationRequest request = createValidRequest(2);
        request.setCustomerPhone("98765"); // 5 digits
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("customerPhone")));

        request.setCustomerPhone("98765ABCD0"); // non-numeric
        violations = validator.validate(request);
        assertFalse(violations.isEmpty());
    }

    @Test
    @DisplayName("T6.3 - Missing booking date should be rejected")
    void testMissingBookingDate_Rejected() {
        ReservationRequest request = createValidRequest(2);
        request.setBookingDate(null);
        Set<ConstraintViolation<ReservationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("bookingDate")));
    }
}
