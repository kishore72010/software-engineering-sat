package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.ReservationRequest;
import com.restaurant.reservation.dto.ReservationResponse;
import com.restaurant.reservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ReservationResponse> reservations = reservationService.getUserReservations(userDetails.getUsername());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        ReservationResponse response = reservationService.getReservationById(userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null ? payload.get("reason") : null;
        ReservationResponse response = reservationService.cancelReservation(userDetails.getUsername(), id, reason);
        return ResponseEntity.ok(response);
    }
}
