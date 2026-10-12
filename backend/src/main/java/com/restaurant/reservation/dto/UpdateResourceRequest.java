package com.restaurant.reservation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

public class UpdateResourceRequest {

    @DecimalMin(value = "0.0", message = "Rate must be non-negative")
    private BigDecimal currentRate;

    @Min(value = 0, message = "Available quantity cannot be negative")
    private Integer availableQuantity;

    private Boolean active;

    public UpdateResourceRequest() {}

    public UpdateResourceRequest(BigDecimal currentRate, Integer availableQuantity, Boolean active) {
        this.currentRate = currentRate;
        this.availableQuantity = availableQuantity;
        this.active = active;
    }

    public BigDecimal getCurrentRate() {
        return currentRate;
    }

    public void setCurrentRate(BigDecimal currentRate) {
        this.currentRate = currentRate;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
