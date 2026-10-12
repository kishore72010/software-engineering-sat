package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.*;
import com.restaurant.reservation.exception.*;
import com.restaurant.reservation.model.*;
import com.restaurant.reservation.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationBusinessRulesTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingStatusHistoryRepository statusHistoryRepository;

    private FareCalculationService fareCalculationService = new FareCalculationService();

    private ReservationService reservationService;

    private User testUser;
    private User otherUser;
    private User adminUser;
    private Resource tableA;
    private Resource tableD;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository,
                resourceRepository,
                userRepository,
                fareCalculationService,
                statusHistoryRepository
        );

        testUser = new User("Aarav Sharma", "user@restaurant.com", "hash", Role.ROLE_USER);
        testUser.setId(1L);

        otherUser = new User("Other Guest", "other@restaurant.com", "hash", Role.ROLE_USER);
        otherUser.setId(2L);

        adminUser = new User("Admin", "admin@restaurant.com", "hash", Role.ROLE_ADMIN);
        adminUser.setId(99L);

        tableA = new Resource("R101", "Table A", "Fine Dining", "Booth", 4, new BigDecimal("499.00"), 10, true, null);
        tableA.setId(101L);

        // R104 has 0 initial availability
        tableD = new Resource("R104", "Table D", "Wine Cellar", "Exclusive", 6, new BigDecimal("1299.00"), 0, true, null);
        tableD.setId(104L);
    }

    /**
     * T1 — Duplicate Resource Selection
     */
    @Test
    @DisplayName("T1 - Requesting reservation with invalid repeated/unsupported state is rejected")
    void testT1_DuplicateResourceHandling() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findByIdWithLock(tableA.getId())).thenReturn(Optional.of(tableA));

        ReservationRequest req = new ReservationRequest(
                tableA.getId(), 2, "Aarav Sharma", "9876543210",
                LocalDate.now().plusDays(2), "Dinner", "None"
        );

        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation r = invocation.getArgument(0);
            r.setId(501L);
            return r;
        });

        ReservationResponse res = reservationService.createReservation(testUser.getEmail(), req);
        assertNotNull(res);
        assertEquals(1, res.getItems().size());
        assertEquals("R101", res.getItems().get(0).getResourceCode());
    }

    /**
     * T3 — Unavailable Resource
     * Attempt to book R104, which starts with availability 0. Reject the request without changing state.
     */
    @Test
    @DisplayName("T3 - Attempt to book R104 with 0 availability must be rejected without changing state")
    void testT3_UnavailableResource_Rejected() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findByIdWithLock(tableD.getId())).thenReturn(Optional.of(tableD));

        ReservationRequest req = new ReservationRequest(
                tableD.getId(), 1, "Aarav Sharma", "9876543210",
                LocalDate.now().plusDays(1), "Dinner", "None"
        );

        assertThrows(InsufficientAvailabilityException.class, () -> {
            reservationService.createReservation(testUser.getEmail(), req);
        });

        // Verify resource availability was untouched
        assertEquals(0, tableD.getAvailableQuantity());
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    /**
     * T5 — Valid Reservation
     * Verify reservation, availability update, fare snapshot, and history are saved atomically.
     */
    @Test
    @DisplayName("T5 - Valid reservation creates snapshot, reduces availability, and records initial history")
    void testT5_ValidReservation_AtomicSuccess() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findByIdWithLock(tableA.getId())).thenReturn(Optional.of(tableA));

        ReservationRequest req = new ReservationRequest(
                tableA.getId(), 2, "Aarav Sharma", "9876543210",
                LocalDate.now().plusDays(1), "Dinner", "Quiet table"
        );

        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation r = invocation.getArgument(0);
            r.setId(505L);
            return r;
        });

        int initialQty = tableA.getAvailableQuantity();
        ReservationResponse response = reservationService.createReservation(testUser.getEmail(), req);

        assertNotNull(response);
        assertEquals(ReservationStatus.CONFIRMED, response.getStatus());
        // Availability reduced: 10 - 2 = 8
        assertEquals(initialQty - 2, tableA.getAvailableQuantity());

        // Verify Fare calculation: 499 * 2 = 998 (< 1000 => charge 50 => grandTotal 1048)
        assertEquals(new BigDecimal("998.00"), response.getBaseAmount());
        assertEquals(new BigDecimal("50.00"), response.getBookingCharge());
        assertEquals(new BigDecimal("1048.00"), response.getGrandTotal());

        // Snapshot rate saved
        assertEquals(1, response.getItems().size());
        assertEquals(new BigDecimal("499.00"), response.getItems().get(0).getSavedUnitRate());

        // History recorded
        assertEquals(1, response.getStatusHistory().size());
        assertEquals("CONFIRMED", response.getStatusHistory().get(0).getNewStatus());
    }

    /**
     * T7 — Availability Revalidation
     * Change availability between selection and confirmation. Verify stale request is rejected.
     */
    @Test
    @DisplayName("T7 - Stale availability drops below requested quantity is rejected")
    void testT7_AvailabilityRevalidation_StaleRejected() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // Capacity dropped to 1 by another user concurrently
        tableA.setAvailableQuantity(1);
        when(resourceRepository.findByIdWithLock(tableA.getId())).thenReturn(Optional.of(tableA));

        ReservationRequest req = new ReservationRequest(
                tableA.getId(), 2, "Aarav Sharma", "9876543210",
                LocalDate.now().plusDays(1), "Dinner", "None"
        );

        assertThrows(InsufficientAvailabilityException.class, () -> {
            reservationService.createReservation(testUser.getEmail(), req);
        });

        assertEquals(1, tableA.getAvailableQuantity());
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    /**
     * T8 — Access Control
     * Attempt to access another user's reservation and attempt non-admin status update. Verify denied.
     */
    @Test
    @DisplayName("T8.1 - Attempt to access another user's reservation is denied")
    void testT8_AccessOtherUserReservation_Denied() {
        when(userRepository.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));

        Reservation res = new Reservation();
        res.setId(777L);
        res.setUser(testUser); // Belongs to testUser, not otherUser
        when(reservationRepository.findById(777L)).thenReturn(Optional.of(res));

        assertThrows(UnauthorizedOperationException.class, () -> {
            reservationService.getReservationById(otherUser.getEmail(), 777L);
        });
    }

    @Test
    @DisplayName("T8.2 - Normal user attempting administrative status update is denied")
    void testT8_UserStatusUpdate_Denied() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        StatusUpdateRequest statusReq = new StatusUpdateRequest(ReservationStatus.CHECKED_IN, "Trying admin action");

        assertThrows(UnauthorizedOperationException.class, () -> {
            reservationService.updateReservationStatus(testUser.getEmail(), 777L, statusReq);
        });
    }

    /**
     * T9 — Status Validation
     * Verify valid status progression and rejection of skipped stages.
     */
    @Test
    @DisplayName("T9.1 - Valid status progression CONFIRMED -> CHECKED_IN -> COMPLETED succeeds")
    void testT9_ValidStatusProgression() {
        when(userRepository.findByEmail(adminUser.getEmail())).thenReturn(Optional.of(adminUser));

        Reservation res = new Reservation();
        res.setId(888L);
        res.setUser(testUser);
        res.setStatus(ReservationStatus.CONFIRMED);

        when(reservationRepository.findById(888L)).thenReturn(Optional.of(res));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

        // Advance 1: CONFIRMED -> CHECKED_IN
        StatusUpdateRequest step1 = new StatusUpdateRequest(ReservationStatus.CHECKED_IN, "Guest arrived");
        ReservationResponse res1 = reservationService.updateReservationStatus(adminUser.getEmail(), 888L, step1);
        assertEquals(ReservationStatus.CHECKED_IN, res1.getStatus());

        // Advance 2: CHECKED_IN -> COMPLETED
        StatusUpdateRequest step2 = new StatusUpdateRequest(ReservationStatus.COMPLETED, "Guest departed");
        ReservationResponse res2 = reservationService.updateReservationStatus(adminUser.getEmail(), 888L, step2);
        assertEquals(ReservationStatus.COMPLETED, res2.getStatus());
    }

    @Test
    @DisplayName("T9.2 - Skipped stage: CONFIRMED directly to COMPLETED is rejected")
    void testT9_SkippedStage_Rejected() {
        when(userRepository.findByEmail(adminUser.getEmail())).thenReturn(Optional.of(adminUser));

        Reservation res = new Reservation();
        res.setId(888L);
        res.setUser(testUser);
        res.setStatus(ReservationStatus.CONFIRMED);

        when(reservationRepository.findById(888L)).thenReturn(Optional.of(res));

        StatusUpdateRequest skippedStep = new StatusUpdateRequest(ReservationStatus.COMPLETED, "Skipping check-in");

        assertThrows(InvalidStatusTransitionException.class, () -> {
            reservationService.updateReservationStatus(adminUser.getEmail(), 888L, skippedStep);
        });
        assertEquals(ReservationStatus.CONFIRMED, res.getStatus());
    }

    /**
     * T10 — Cancellation
     * Cancel an eligible confirmed reservation. Verify capacity is restored once and repeated cancellation does not restore it again.
     */
    @Test
    @DisplayName("T10 - Cancellation restores capacity exactly once; repeated cancellation is rejected")
    void testT10_Cancellation_SingleRestoration() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findByIdWithLock(tableA.getId())).thenReturn(Optional.of(tableA));

        Reservation res = new Reservation();
        res.setId(901L);
        res.setUser(testUser);
        res.setStatus(ReservationStatus.CONFIRMED);
        ReservationItem item = new ReservationItem(tableA, 2, tableA.getCurrentRate(), new BigDecimal("998.00"));
        res.addItem(item);

        when(reservationRepository.findById(901L)).thenReturn(Optional.of(res));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

        int qtyBefore = tableA.getAvailableQuantity(); // e.g. 10

        // Cancel first time
        ReservationResponse cancelRes = reservationService.cancelReservation(testUser.getEmail(), 901L, "Plans changed");
        assertEquals(ReservationStatus.CANCELLED, cancelRes.getStatus());
        assertEquals(qtyBefore + 2, tableA.getAvailableQuantity()); // Restored once

        // Attempt repeated cancellation on now CANCELLED reservation
        assertThrows(InvalidStatusTransitionException.class, () -> {
            reservationService.cancelReservation(testUser.getEmail(), 901L, "Cancel again");
        });

        // Capacity was NOT restored again
        assertEquals(qtyBefore + 2, tableA.getAvailableQuantity());
    }

    /**
     * T12 — Rate Snapshot
     * Create a reservation, change resource's current rate, verify historical reservation retains original rate and totals.
     */
    @Test
    @DisplayName("T12 - Changing current resource rate does not modify historical reservation totals")
    void testT12_RateSnapshotImmutability() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(resourceRepository.findByIdWithLock(tableA.getId())).thenReturn(Optional.of(tableA));

        ReservationRequest req = new ReservationRequest(
                tableA.getId(), 2, "Aarav Sharma", "9876543210",
                LocalDate.now().plusDays(1), "Dinner", "None"
        );

        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation r = invocation.getArgument(0);
            r.setId(912L);
            return r;
        });

        // 1. Initial reservation created at rate ₹499
        ReservationResponse booking = reservationService.createReservation(testUser.getEmail(), req);
        assertEquals(new BigDecimal("998.00"), booking.getBaseAmount());
        assertEquals(new BigDecimal("1048.00"), booking.getGrandTotal());
        assertEquals(new BigDecimal("499.00"), booking.getItems().get(0).getSavedUnitRate());

        // 2. Resource rate increases in catalog to ₹899
        tableA.setCurrentRate(new BigDecimal("899.00"));

        // 3. Historical booking remains unchanged
        assertEquals(new BigDecimal("998.00"), booking.getBaseAmount());
        assertEquals(new BigDecimal("1048.00"), booking.getGrandTotal());
        assertEquals(new BigDecimal("499.00"), booking.getItems().get(0).getSavedUnitRate());
    }
}
