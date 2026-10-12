package com.restaurant.reservation.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class ReservationRequest {

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be between 1 and 5")
    @Max(value = 5, message = "Quantity must be between 1 and 5")
    private Integer quantity;

    @NotBlank(message = "Customer name must not be blank")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String customerName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 numeric digits")
    private String customerPhone;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotBlank(message = "Dining slot is required")
    private String diningSlot = "Dinner (19:30 - 21:30)";

    private String specialRequests;

    public ReservationRequest() {}

    public ReservationRequest(Long resourceId, Integer quantity, String customerName,
                              String customerPhone, LocalDate bookingDate, String diningSlot,
                              String specialRequests) {
        this.resourceId = resourceId;
        this.quantity = quantity;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.bookingDate = bookingDate;
        this.diningSlot = diningSlot;
        this.specialRequests = specialRequests;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getDiningSlot() {
        return diningSlot;
    }

    public void setDiningSlot(String diningSlot) {
        this.diningSlot = diningSlot;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
}
