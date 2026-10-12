package com.restaurant.reservation.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FareCalculationService {

    public static final BigDecimal THRESHOLD = new BigDecimal("1000.00");
    public static final BigDecimal BOOKING_CHARGE_BELOW_THRESHOLD = new BigDecimal("50.00");
    public static final BigDecimal ZERO_CHARGE = new BigDecimal("0.00");

    /**
     * Calculates base amount = unitRate * quantity.
     */
    public BigDecimal calculateBaseAmount(BigDecimal unitRate, int quantity) {
        if (unitRate == null || quantity <= 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return unitRate.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * BR4: Booking charge = ₹50 if baseAmount < ₹1000; otherwise ₹0.
     */
    public BigDecimal calculateBookingCharge(BigDecimal baseAmount) {
        if (baseAmount == null) {
            return ZERO_CHARGE.setScale(2, RoundingMode.HALF_UP);
        }
        if (baseAmount.compareTo(THRESHOLD) < 0) {
            return BOOKING_CHARGE_BELOW_THRESHOLD.setScale(2, RoundingMode.HALF_UP);
        } else {
            return ZERO_CHARGE.setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Grand total = baseAmount + bookingCharge.
     */
    public BigDecimal calculateGrandTotal(BigDecimal baseAmount, BigDecimal bookingCharge) {
        BigDecimal base = baseAmount != null ? baseAmount : BigDecimal.ZERO;
        BigDecimal charge = bookingCharge != null ? bookingCharge : BigDecimal.ZERO;
        return base.add(charge).setScale(2, RoundingMode.HALF_UP);
    }
}
