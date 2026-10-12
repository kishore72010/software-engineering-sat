package com.restaurant.reservation.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Mandatory Test T4 — Fare Calculation.
 * Test base amounts ₹999, ₹1000, and ₹1001.
 * Expected booking charges: ₹50, ₹0, and ₹0.
 */
class FareCalculationServiceTest {

    private FareCalculationService fareCalculationService;

    @BeforeEach
    void setUp() {
        fareCalculationService = new FareCalculationService();
    }

    @Test
    @DisplayName("T4.1 - Base amount ₹999: Booking charge should be ₹50, Grand total ₹1049")
    void testFareCalculation_BaseAmount999() {
        BigDecimal baseAmount = new BigDecimal("999.00");
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        BigDecimal grandTotal = fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge);

        assertEquals(new BigDecimal("50.00"), bookingCharge);
        assertEquals(new BigDecimal("1049.00"), grandTotal);
    }

    @Test
    @DisplayName("T4.2 - Base amount ₹1000: Booking charge should be ₹0, Grand total ₹1000")
    void testFareCalculation_BaseAmount1000() {
        BigDecimal baseAmount = new BigDecimal("1000.00");
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        BigDecimal grandTotal = fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge);

        assertEquals(new BigDecimal("0.00"), bookingCharge);
        assertEquals(new BigDecimal("1000.00"), grandTotal);
    }

    @Test
    @DisplayName("T4.3 - Base amount ₹1001: Booking charge should be ₹0, Grand total ₹1001")
    void testFareCalculation_BaseAmount1001() {
        BigDecimal baseAmount = new BigDecimal("1001.00");
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        BigDecimal grandTotal = fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge);

        assertEquals(new BigDecimal("0.00"), bookingCharge);
        assertEquals(new BigDecimal("1001.00"), grandTotal);
    }

    @Test
    @DisplayName("Base amount multiplication: unitRate * quantity")
    void testBaseAmountCalculation() {
        BigDecimal unitRate = new BigDecimal("499.00");
        int quantity = 2;
        BigDecimal baseAmount = fareCalculationService.calculateBaseAmount(unitRate, quantity);

        assertEquals(new BigDecimal("998.00"), baseAmount);
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        assertEquals(new BigDecimal("50.00"), bookingCharge);
        assertEquals(new BigDecimal("1048.00"), fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge));
    }
}
