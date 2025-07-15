package com.phoenixfitness.controller;

import com.phoenixfitness.dto.ApiResponse;
import com.phoenixfitness.dto.BookingRequest;
import com.phoenixfitness.dto.SessionRequest;
import com.phoenixfitness.entity.Booking;
import com.phoenixfitness.entity.Session;
import com.phoenixfitness.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Session>>> getAllSessions() {
        try {
            List<Session> sessions = sessionService.getAllSessions();
            return ResponseEntity.ok(new ApiResponse<>(true, sessions, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Session>> getSessionById(@PathVariable Long id) {
        try {
            Session session = sessionService.getSessionById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, session, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<Session>>> getUpcomingSessions() {
        try {
            List<Session> sessions = sessionService.getUpcomingSessions();
            return ResponseEntity.ok(new ApiResponse<>(true, sessions, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Booking>> bookSession(@PathVariable Long id, 
                                                           @Valid @RequestBody BookingRequest request,
                                                           Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Booking booking = sessionService.bookSession(id, request, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, booking, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Session>> createSession(@Valid @RequestBody SessionRequest request) {
        try {
            Session session = sessionService.createSession(request);
            return ResponseEntity.ok(new ApiResponse<>(true, session, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Session>> updateSession(@PathVariable Long id, 
                                                            @Valid @RequestBody SessionRequest request) {
        try {
            Session session = sessionService.updateSession(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, session, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteSession(@PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Session deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }
}