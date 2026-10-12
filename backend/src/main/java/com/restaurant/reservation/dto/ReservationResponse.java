package com.restaurant.reservation.dto;

import com.restaurant.reservation.model.ReservationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReservationResponse {

    private Long id;
    private String uniqueBookingReference;
    private Long userId;
    private String userEmail;
    private String customerName;
    private String customerPhone;
    private LocalDate bookingDate;
    private String diningSlot;
    private String specialRequests;
    private ReservationStatus status;
    private BigDecimal baseAmount;
    private BigDecimal bookingCharge;
    private BigDecimal grandTotal;
    private List<ReservationItemResponse> items = new ArrayList<>();
    private List<BookingStatusHistoryResponse> statusHistory = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReservationResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUniqueBookingReference() {
        return uniqueBookingReference;
    }

    public void setUniqueBookingReference(String uniqueBookingReference) {
        this.uniqueBookingReference = uniqueBookingReference;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public BigDecimal getBaseAmount() {
        return baseAmount;
    }

    public void setBaseAmount(BigDecimal baseAmount) {
        this.baseAmount = baseAmount;
    }

    public BigDecimal getBookingCharge() {
        return bookingCharge;
    }

    public void setBookingCharge(BigDecimal bookingCharge) {
        this.bookingCharge = bookingCharge;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public List<ReservationItemResponse> getItems() {
        return items;
    }

    public void setItems(List<ReservationItemResponse> items) {
        this.items = items;
    }

    public List<BookingStatusHistoryResponse> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<BookingStatusHistoryResponse> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
