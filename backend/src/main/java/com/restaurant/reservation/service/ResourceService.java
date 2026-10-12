package com.restaurant.reservation.service;

import com.restaurant.reservation.dto.FareCalculationRequest;
import com.restaurant.reservation.dto.FareCalculationResponse;
import com.restaurant.reservation.dto.ResourceResponse;
import com.restaurant.reservation.dto.UpdateResourceRequest;
import com.restaurant.reservation.exception.ResourceNotFoundException;
import com.restaurant.reservation.model.Resource;
import com.restaurant.reservation.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final FareCalculationService fareCalculationService;

    public ResourceService(ResourceRepository resourceRepository,
                           FareCalculationService fareCalculationService) {
        this.resourceRepository = resourceRepository;
        this.fareCalculationService = fareCalculationService;
    }

    public List<ResourceResponse> getAllActiveResources() {
        return resourceRepository.findByActiveTrueOrderByCurrentRateAsc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ResourceResponse> getAllResourcesForAdmin() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ResourceResponse getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        return mapToDto(resource);
    }

    public Resource getResourceEntityById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
    }

    public FareCalculationResponse calculateFare(FareCalculationRequest request) {
        Resource resource = getResourceEntityById(request.getResourceId());
        int quantity = request.getQuantity();

        BigDecimal baseAmount = fareCalculationService.calculateBaseAmount(resource.getCurrentRate(), quantity);
        BigDecimal bookingCharge = fareCalculationService.calculateBookingCharge(baseAmount);
        BigDecimal grandTotal = fareCalculationService.calculateGrandTotal(baseAmount, bookingCharge);

        return new FareCalculationResponse(
                resource.getId(),
                resource.getResourceCode(),
                resource.getDisplayName(),
                resource.getCurrentRate(),
                quantity,
                baseAmount,
                bookingCharge,
                grandTotal
        );
    }

    @Transactional
    public ResourceResponse updateResource(Long id, UpdateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        if (request.getCurrentRate() != null) {
            resource.setCurrentRate(request.getCurrentRate());
        }
        if (request.getAvailableQuantity() != null) {
            resource.setAvailableQuantity(request.getAvailableQuantity());
        }
        if (request.getActive() != null) {
            resource.setActive(request.getActive());
        }

        Resource updated = resourceRepository.save(resource);
        return mapToDto(updated);
    }

    public ResourceResponse mapToDto(Resource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getResourceCode(),
                resource.getDisplayName(),
                resource.getCategory(),
                resource.getDescription(),
                resource.getSeatingCapacity(),
                resource.getCurrentRate(),
                resource.getAvailableQuantity(),
                resource.getActive(),
                resource.getImageUrl()
        );
    }
}
