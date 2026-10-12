package com.restaurant.reservation.repository;

import com.restaurant.reservation.model.Resource;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByResourceCode(String resourceCode);

    List<Resource> findByActiveTrue();

    List<Resource> findByActiveTrueOrderByCurrentRateAsc();

    /**
     * Pessimistic row locking to prevent race-conditions or concurrent overselling.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Resource r WHERE r.id = :id")
    Optional<Resource> findByIdWithLock(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Resource r WHERE r.resourceCode = :code")
    Optional<Resource> findByResourceCodeWithLock(@Param("code") String code);
}
