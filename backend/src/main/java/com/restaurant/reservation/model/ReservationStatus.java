package com.restaurant.reservation.model;

public enum ReservationStatus {
    CONFIRMED,
    CHECKED_IN,
    COMPLETED,
    CANCELLED;

    /**
     * BR8: Valid administrative operational status transition sequence.
     * Allowed progression: CONFIRMED -> CHECKED_IN -> COMPLETED.
     * Skipping stages or invalid transitions return false.
     */
    public boolean canAdminTransitionTo(ReservationStatus target) {
        if (this == CONFIRMED && target == CHECKED_IN) {
            return true;
        }
        if (this == CHECKED_IN && target == COMPLETED) {
            return true;
        }
        return false;
    }

    /**
     * BR8 / BR9: Only CONFIRMED reservations can be cancelled.
     */
    public boolean canBeCancelled() {
        return this == CONFIRMED;
    }
}
