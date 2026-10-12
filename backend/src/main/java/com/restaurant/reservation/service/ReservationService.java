package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.*;
import com.restaurant.reservation.exception.*;
import com.restaurant.reservation.model.*;
import com.restaurant.reservation.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final FareCalculationService fareCalculationService;
    private final BookingStatusHistoryRepository statusHistoryRepository;
    private final SecureRandom random = new SecureRandom();

    public ReservationService(ReservationRepository reservationRepository,
                              ResourceRepository resourceRepository,
                              UserRepository userRepository,
                              FareCalculationService fareCalculationService,
                              BookingStatusHistoryRepository statusHistoryRepository) {
        this.reservationRepository = reservationRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.fareCalculationService = fareCalculationService;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    /**
     * BR1, BR2, BR3, BR4, BR5, BR6, BR7: Atomic Reservation Creation
     */
    @Transactional
    public ReservationResponse createReservation(String userEmail, ReservationRequest request) {
        // BR5: Validate User details
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedOperationException("User not authenticated or found"));

        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new InvalidReservationException("Customer name must not be blank");
        }

        if (request.getCustomerPhone() == null || !request.getCustomerPhone().matches("^[0-9]{10}$")) {
            throw new InvalidReservationException("Customer phone must contain exactly 10 numeric digits");
        }

        if (request.getBookingDate() == null || request.getBookingDate().isBefore(LocalDate.now())) {
            throw new InvalidReservationException("Booking date cannot be in the past");
        }

        // BR1: Validate Quantity (1 to 5 inclusive)
        if (request.getQuantity() == null || request.getQuantity() < 1 || request.getQuantity() > 5) {
            throw new InvalidReservationException("Quantity must be an integer between 1 and 5 inclusive");
        }

        // BR2: Acquire pessimistic lock on the resource to prevent concurrent overselling
        Resource resource = resourceRepository.findByIdWithLock(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + request.getResourceId()));

        if (!Boolean.TRUE.equals(resource.getActive())) {
            throw new InvalidReservationException("Selected table resource is currently inactive");
        }

        // BR2 & BR6: Server-side availability re-validation
        if (resource.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientAvailabilityException(String.format(
                    "Insufficient capacity for %s (%s). Requested: %d, Available: %d",
                    resource.getDisplayName(), resource.getResourceCode(),
                    request.getQuantity(), resource.getAvailableQuantity()
            ));
        }

        // BR3 & BR4: Fare snapshot and server-side calculation
        BigDecimal snapshotUnitRate = resource.getCurrentRate();
        BigDecimal baseAmount = fareCalculationService.calculateBaseAmount(snapshotUnitRate, request.getQuantity());
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        BigDecimal grandTotal = fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge);

        // Deduct inventory capacity
        resource.setAvailableQuantity(resource.getAvailableQuantity() - request.getQuantity());
        resourceRepository.save(resource);

        // Generate unique reference
        String bookingRef = generateUniqueBookingReference();

        // Create Reservation Entity
        Reservation reservation = new Reservation();
        reservation.setUniqueBookingReference(bookingRef);
        reservation.setUser(user);
        reservation.setCustomerName(request.getCustomerName().trim());
        reservation.setCustomerPhone(request.getCustomerPhone().trim());
        reservation.setBookingDate(request.getBookingDate());
        reservation.setDiningSlot(request.getDiningSlot() != null ? request.getDiningSlot() : "Dinner (19:30 - 21:30)");
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setBaseAmount(baseAmount);
        reservation.setBookingCharge(bookingCharge);
        reservation.setGrandTotal(grandTotal);

        // BR3: Save Reservation Item with Unit Rate Snapshot
        ReservationItem item = new ReservationItem(resource, request.getQuantity(), snapshotUnitRate, baseAmount);
        reservation.addItem(item);

        // Record Initial Audit History
        BookingStatusHistory history = new BookingStatusHistory(
                null,
                ReservationStatus.CONFIRMED.name(),
                user.getEmail(),
                "Initial reservation confirmed"
        );
        reservation.addStatusHistory(history);

        Reservation savedReservation = reservationRepository.save(reservation);
        return mapToDto(savedReservation);
    }

    /**
     * BR8, BR9, BR10: Cancellation Logic with Single-Restoration Guarantee
     */
    @Transactional
    public ReservationResponse cancelReservation(String userEmail, Long reservationId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + reservationId));

        // BR10: Authorization check - User can only cancel their own booking (or admin)
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedOperationException("User not authenticated"));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = reservation.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedOperationException("You are not authorized to cancel this reservation");
        }

        // BR8 / BR9: Only CONFIRMED reservations may be cancelled
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new InvalidStatusTransitionException(String.format(
                    "Reservation cannot be cancelled because it is in '%s' status. Only CONFIRMED bookings are eligible for cancellation.",
                    reservation.getStatus()
            ));
        }

        ReservationStatus previousStatus = reservation.getStatus();
        reservation.setStatus(ReservationStatus.CANCELLED);

        // BR9: Restore reserved capacity exactly once with row-level lock
        for (ReservationItem item : reservation.getItems()) {
            Resource resource = resourceRepository.findByIdWithLock(item.getResource().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
            resource.setAvailableQuantity(resource.getAvailableQuantity() + item.getQuantity());
            resourceRepository.save(resource);
        }

        // Audit Trail
        String remarks = (reason != null && !reason.trim().isEmpty())
                ? "Cancelled: " + reason.trim()
                : "Cancelled by " + (isAdmin ? "Administrator" : "Customer");

        BookingStatusHistory history = new BookingStatusHistory(
                previousStatus.name(),
                ReservationStatus.CANCELLED.name(),
                currentUser.getEmail(),
                remarks
        );
        reservation.addStatusHistory(history);

        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToDto(updatedReservation);
    }

    /**
     * BR7, BR8, BR10: Admin Operational Status Progression (CONFIRMED -> CHECKED_IN -> COMPLETED)
     */
    @Transactional
    public ReservationResponse updateReservationStatus(String adminEmail, Long reservationId, StatusUpdateRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new UnauthorizedOperationException("Admin user not found"));

        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedOperationException("Only administrators can update reservation status");
        }

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + reservationId));

        ReservationStatus currentStatus = reservation.getStatus();
        ReservationStatus targetStatus = request.getStatus();

        // BR8: Strict operational progression sequence
        if (!currentStatus.canAdminTransitionTo(targetStatus)) {
            throw new InvalidStatusTransitionException(String.format(
                    "Invalid status transition from '%s' to '%s'. Allowed progression: CONFIRMED -> CHECKED_IN -> COMPLETED.",
                    currentStatus, targetStatus
            ));
        }

        reservation.setStatus(targetStatus);

        String remarks = (request.getRemarks() != null && !request.getRemarks().trim().isEmpty())
                ? request.getRemarks().trim()
                : "Status advanced to " + targetStatus + " by Administrator";

        BookingStatusHistory history = new BookingStatusHistory(
                currentStatus.name(),
                targetStatus.name(),
                admin.getEmail(),
                remarks
        );
        reservation.addStatusHistory(history);

        Reservation updated = reservationRepository.save(reservation);
        return mapToDto(updated);
    }

    /**
     * BR6, BR10: Get User's Own Reservations
     */
    public List<ReservationResponse> getUserReservations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedOperationException("User not found"));

        return reservationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * BR10: Get Specific Reservation by ID with ownership enforcement
     */
    public ReservationResponse getReservationById(String userEmail, Long reservationId) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedOperationException("User not found"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + reservationId));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = reservation.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedOperationException("Access denied: You do not own this reservation record");
        }

        return mapToDto(reservation);
    }

    /**
     * Admin: Get all reservations
     */
    public List<ReservationResponse> getAllReservationsForAdmin() {
        return reservationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Admin Dashboard Statistics
     */
    public AdminDashboardStatsResponse getAdminDashboardStats() {
        long total = reservationRepository.countTotalReservations();
        long confirmed = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
        long checkedIn = reservationRepository.countByStatus(ReservationStatus.CHECKED_IN);
        long completed = reservationRepository.countByStatus(ReservationStatus.COMPLETED);
        long cancelled = reservationRepository.countByStatus(ReservationStatus.CANCELLED);

        // Total revenue from non-cancelled bookings
        BigDecimal revenue = reservationRepository.findAll()
                .stream()
                .filter(r -> r.getStatus() != ReservationStatus.CANCELLED)
                .map(Reservation::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardStatsResponse(total, confirmed, checkedIn, completed, cancelled, revenue);
    }

    private String generateUniqueBookingReference() {
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomHex = Integer.toHexString(random.nextInt(0xEFFFF) + 0x10000).toUpperCase();
        return "RES-" + datePrefix + "-" + randomHex;
    }

    public ReservationResponse mapToDto(Reservation reservation) {
        ReservationResponse dto = new ReservationResponse();
        dto.setId(reservation.getId());
        dto.setUniqueBookingReference(reservation.getUniqueBookingReference());
        dto.setUserId(reservation.getUser().getId());
        dto.setUserEmail(reservation.getUser().getEmail());
        dto.setCustomerName(reservation.getCustomerName());
        dto.setCustomerPhone(reservation.getCustomerPhone());
        dto.setBookingDate(reservation.getBookingDate());
        dto.setDiningSlot(reservation.getDiningSlot());
        dto.setSpecialRequests(reservation.getSpecialRequests());
        dto.setStatus(reservation.getStatus());
        dto.setBaseAmount(reservation.getBaseAmount());
        dto.setBookingCharge(reservation.getBookingCharge());
        dto.setGrandTotal(reservation.getGrandTotal());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());

        if (reservation.getItems() != null) {
            dto.setItems(reservation.getItems().stream().map(item -> new ReservationItemResponse(
                    item.getId(),
                    item.getResource().getId(),
                    item.getResource().getResourceCode(),
                    item.getResource().getDisplayName(),
                    item.getQuantity(),
                    item.getSavedUnitRate(),
                    item.getSavedBaseAmount()
            )).collect(Collectors.toList()));
        }

        if (reservation.getStatusHistory() != null) {
            dto.setStatusHistory(reservation.getStatusHistory().stream().map(h -> new BookingStatusHistoryResponse(
                    h.getId(),
                    h.getPreviousStatus(),
                    h.getNewStatus(),
                    h.getChangedBy(),
                    h.getChangedAt(),
                    h.getRemarks()
            )).collect(Collectors.toList()));
        }

        return dto;
    }
}
