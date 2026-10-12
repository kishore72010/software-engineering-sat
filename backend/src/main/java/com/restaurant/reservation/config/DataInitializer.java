package com.restaurant.reservation.config;

import com.restaurant.reservation.model.Resource;
import com.restaurant.reservation.model.Role;
import com.restaurant.reservation.model.User;
import com.restaurant.reservation.repository.ResourceRepository;
import com.restaurant.reservation.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ResourceRepository resourceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedResources();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@restaurant.com")) {
            User admin = new User(
                    "Master Sommelier & Admin",
                    "admin@restaurant.com",
                    passwordEncoder.encode("Admin@123"),
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
            log.info("Initialized default ADMIN account: admin@restaurant.com");
        }

        if (!userRepository.existsByEmail("user@restaurant.com")) {
            User demoUser = new User(
                    "Aarav Sharma",
                    "user@restaurant.com",
                    passwordEncoder.encode("User@123"),
                    Role.ROLE_USER
            );
            userRepository.save(demoUser);
            log.info("Initialized default USER account: user@restaurant.com");
        }
    }

    private void seedResources() {
        // Demonstration initial data according to specification:
        // R101 | Table A | 499  | 10
        // R102 | Table B | 799  | 5
        // R103 | Table C | 199  | 20
        // R104 | Table D | 1299 | 0
        // R105 | Table E | 1000 | 3

        List<Resource> defaultResources = Arrays.asList(
                new Resource("R101", "Table A", "Fine Dining Booth",
                        "Luxurious velvet booth suited for intimate fine dining and business discussions.",
                        4, new BigDecimal("499.00"), 10, true,
                        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"),

                new Resource("R102", "Table B", "Window Panoramic View",
                        "Spectacular panoramic city skyline views with sunset ambient lighting.",
                        4, new BigDecimal("799.00"), 5, true,
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"),

                new Resource("R103", "Table C", "Casual Garden Terrace",
                        "Refreshing open-air terrace seating surrounded by lush vertical botanical flora.",
                        2, new BigDecimal("199.00"), 20, true,
                        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"),

                new Resource("R104", "Table D", "Private Wine Cellar Suite",
                        "Exclusive acoustic-treated wine cellar alcove with private sommelier service.",
                        6, new BigDecimal("1299.00"), 0, true,
                        "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80"),

                new Resource("R105", "Table E", "Chef's Culinary Counter",
                        "Direct front-row seating watching the Master Chef craft gastronomic degustation dishes.",
                        2, new BigDecimal("1000.00"), 3, true,
                        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80")
        );

        for (Resource resource : defaultResources) {
            if (resourceRepository.findByResourceCode(resource.getResourceCode()).isEmpty()) {
                resourceRepository.save(resource);
                log.info("Initialized resource: {} - {}", resource.getResourceCode(), resource.getDisplayName());
            }
        }
    }
}
