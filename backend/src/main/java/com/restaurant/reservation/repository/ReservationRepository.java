package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.Reservation;
import com.restaurant.reservation.model.ReservationStatus;
import com.restaurant.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUniqueBookingReference(String uniqueBookingReference);

    List<Reservation> findByUserOrderByCreatedAtDesc(User user);

    List<Reservation> findAllByOrderByCreatedAtDesc();

    Optional<Reservation> findByIdAndUser(Long id, User user);

    long countByStatus(ReservationStatus status);

    @Query("SELECT COUNT(r) FROM Reservation r")
    long countTotalReservations();
}
