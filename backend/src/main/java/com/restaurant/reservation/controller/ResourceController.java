package com.restaurant.reservation.controller;

import com.restaurant.reservation.dto.FareCalculationRequest;
import com.restaurant.reservation.dto.FareCalculationResponse;
import com.restaurant.reservation.dto.ResourceResponse;
import com.restaurant.reservation.dto.UpdateResourceRequest;
import com.restaurant.reservation.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllActiveResources() {
        return ResponseEntity.ok(resourceService.getAllActiveResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping("/calculate-fare")
    public ResponseEntity<FareCalculationResponse> calculateFare(@Valid @RequestBody FareCalculationRequest request) {
        return ResponseEntity.ok(resourceService.calculateFare(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResourceRequest request) {
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }
}
