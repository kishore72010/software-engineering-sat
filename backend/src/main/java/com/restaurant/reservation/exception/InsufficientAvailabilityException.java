package com.restaurant.reservation.exception;

public class InsufficientAvailabilityException extends RuntimeException {
    public InsufficientAvailabilityException(String message) {
        super(message);
    }
}
