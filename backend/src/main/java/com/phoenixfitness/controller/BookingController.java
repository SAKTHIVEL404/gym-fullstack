package com.phoenixfitness.controller;

import com.phoenixfitness.dto.ApiResponse;
import com.phoenixfitness.entity.Booking;
import com.phoenixfitness.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> getUserBookings(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Booking> bookings = bookingService.getUserBookings(userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(new ApiResponse<>(true, bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(@PathVariable Long id, 
                                                                   @RequestBody UpdateStatusRequest request) {
        try {
            Booking booking = bookingService.updateBookingStatus(id, request.getStatus());
            return ResponseEntity.ok(new ApiResponse<>(true, booking, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    public static class UpdateStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}