package com.restaurant.reservation.dto;

import java.math.BigDecimal;

public class ResourceResponse {

    private Long id;
    private String resourceCode;
    private String displayName;
    private String category;
    private String description;
    private Integer seatingCapacity;
    private BigDecimal currentRate;
    private Integer availableQuantity;
    private Boolean active;
    private String imageUrl;

    public ResourceResponse() {}

    public ResourceResponse(Long id, String resourceCode, String displayName, String category,
                            String description, Integer seatingCapacity, BigDecimal currentRate,
                            Integer availableQuantity, Boolean active, String imageUrl) {
        this.id = id;
        this.resourceCode = resourceCode;
        this.displayName = displayName;
        this.category = category;
        this.description = description;
        this.seatingCapacity = seatingCapacity;
        this.currentRate = currentRate;
        this.availableQuantity = availableQuantity;
        this.active = active;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
