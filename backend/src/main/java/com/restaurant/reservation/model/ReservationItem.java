package com.restaurant.reservation.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "reservation_items")
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "saved_unit_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal savedUnitRate;

    @Column(name = "saved_base_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal savedBaseAmount;

    public ReservationItem() {}

    public ReservationItem(Resource resource, Integer quantity, BigDecimal savedUnitRate, BigDecimal savedBaseAmount) {
        this.resource = resource;
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

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
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
