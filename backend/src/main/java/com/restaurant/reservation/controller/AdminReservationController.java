package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.AdminDashboardStatsResponse;
import com.restaurant.reservation.dto.ReservationResponse;
import com.restaurant.reservation.dto.ResourceResponse;
import com.restaurant.reservation.dto.StatusUpdateRequest;
import com.restaurant.reservation.service.ReservationService;
import com.restaurant.reservation.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminReservationController {

    private final ReservationService reservationService;
    private final ResourceService resourceService;

    public AdminReservationController(ReservationService reservationService,
                                      ResourceService resourceService) {
        this.reservationService = reservationService;
        this.resourceService = resourceService;
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservationsForAdmin());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getStats() {
        return ResponseEntity.ok(reservationService.getAdminDashboardStats());
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceResponse>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResourcesForAdmin());
    }

    @PatchMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponse> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        ReservationResponse response = reservationService.updateReservationStatus(
                userDetails.getUsername(), id, request
        );
        return ResponseEntity.ok(response);
    }
}
