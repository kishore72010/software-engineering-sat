package com.restaurant.reservation.dto;

import java.math.BigDecimal;

public class AdminDashboardStatsResponse {

    private long totalReservations;
    private long confirmedCount;
    private long checkedInCount;
    private long completedCount;
    private long cancelledCount;
    private BigDecimal totalRevenue;

    public AdminDashboardStatsResponse() {}

    public AdminDashboardStatsResponse(long totalReservations, long confirmedCount,
                                      long checkedInCount, long completedCount,
                                      long cancelledCount, BigDecimal totalRevenue) {
        this.totalReservations = totalReservations;
        this.confirmedCount = confirmedCount;
        this.checkedInCount = checkedInCount;
        this.completedCount = completedCount;
        this.cancelledCount = cancelledCount;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getConfirmedCount() {
        return confirmedCount;
    }

    public void setConfirmedCount(long confirmedCount) {
        this.confirmedCount = confirmedCount;
    }

    public long getCheckedInCount() {
        return checkedInCount;
    }

    public void setCheckedInCount(long checkedInCount) {
        this.checkedInCount = checkedInCount;
    }

    public long getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(long completedCount) {
        this.completedCount = completedCount;
    }

    public long getCancelledCount() {
        return cancelledCount;
    }

    public void setCancelledCount(long cancelledCount) {
        this.cancelledCount = cancelledCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
