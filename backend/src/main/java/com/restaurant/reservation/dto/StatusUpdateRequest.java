package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.ReservationStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "New target status is required")
    private ReservationStatus status;

    private String remarks;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(ReservationStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
