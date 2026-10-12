package com.restaurant.reservation.dto;

import java.math.BigDecimal;

public class ReservationItemResponse {

    private Long id;
    private Long resourceId;
    private String resourceCode;
    private String displayName;
    private Integer quantity;
    private BigDecimal savedUnitRate;
    private BigDecimal savedBaseAmount;

    public ReservationItemResponse() {}

    public ReservationItemResponse(Long id, Long resourceId, String resourceCode,
                                   String displayName, Integer quantity,
                                   BigDecimal savedUnitRate, BigDecimal savedBaseAmount) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceCode = resourceCode;
        this.displayName = displayName;
        this.quantity = quantity;
        this.savedUnitRate = savedUnitRate;
        this.savedBaseAmount = savedBaseAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSavedUnitRate() {
        return savedUnitRate;
    }

    public void setSavedUnitRate(BigDecimal savedUnitRate) {
        this.savedUnitRate = savedUnitRate;
    }

    public BigDecimal getSavedBaseAmount() {
        return savedBaseAmount;
    }

    public void setSavedBaseAmount(BigDecimal savedBaseAmount) {
        this.savedBaseAmount = savedBaseAmount;
    }
}
