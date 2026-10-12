package com.restaurant.reservation.dto;

import java.math.BigDecimal;

public class FareCalculationResponse {

    private Long resourceId;
    private String resourceCode;
    private String displayName;
    private BigDecimal unitRate;
    private Integer quantity;
    private BigDecimal baseAmount;
    private BigDecimal bookingCharge;
    private BigDecimal grandTotal;

    public FareCalculationResponse() {}

    public FareCalculationResponse(Long resourceId, String resourceCode, String displayName,
                                   BigDecimal unitRate, Integer quantity, BigDecimal baseAmount,
                                   BigDecimal bookingCharge, BigDecimal grandTotal) {
        this.resourceId = resourceId;
        this.resourceCode = resourceCode;
        this.displayName = displayName;
        this.unitRate = unitRate;
        this.quantity = quantity;
        this.baseAmount = baseAmount;
        this.bookingCharge = bookingCharge;
        this.grandTotal = grandTotal;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public BigDecimal getUnitRate() {
        return unitRate;
    }

    public void setUnitRate(BigDecimal unitRate) {
        this.unitRate = unitRate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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
}
