package com.restaurant.reservation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.reservation.dto.AuthRequest;
import com.restaurant.reservation.dto.AuthResponse;
import com.restaurant.reservation.dto.ReservationRequest;
import com.restaurant.reservation.model.ReservationStatus;
import com.restaurant.reservation.repository.ReservationRepository;
import com.restaurant.reservation.repository.ResourceRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-End Spring Boot Integration Test.
 * Covers API endpoints, JWT authentication filter, database transaction persistence (T11).
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class ReservationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    @DisplayName("T11 & E2E: Full reservation flow, API validation, and database persistence")
    void testEndToEndReservationAndPersistence() throws Exception {
        // 1. Authenticate with seeded user credentials
        AuthRequest loginReq = new AuthRequest("user@restaurant.com", "User@123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), AuthResponse.class
        );
        String token = authResponse.getToken();
        assertNotNull(token);

        // 2. Fetch public resources
        mockMvc.perform(get("/api/resources"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // 3. Create a reservation via POST /api/reservations
        Long tableAId = resourceRepository.findByResourceCode("R101").orElseThrow().getId();
        ReservationRequest reservationReq = new ReservationRequest(
                tableAId,
                2,
                "Aarav Sharma",
                "9876543210",
                LocalDate.now().plusDays(3),
                "Dinner (19:30 - 21:30)",
                "Window side table"
        );

        MvcResult bookingResult = mockMvc.perform(post("/api/reservations")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservationReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.uniqueBookingReference").exists())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andReturn();

        // 4. Verify persistence in Database Repository (T11)
        assertTrue(reservationRepository.count() > 0, "Reservation must be persisted in database");
    }
}
