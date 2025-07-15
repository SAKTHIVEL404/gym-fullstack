package com.phoenixfitness.controller;

import com.phoenixfitness.dto.ApiResponse;
import com.phoenixfitness.dto.CreateOrderRequest;
import com.phoenixfitness.dto.VerifyPaymentRequest;
import com.phoenixfitness.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                                       Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Map<String, Object> orderData = paymentService.createOrder(request, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, orderData, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request,
                                                           Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            String result = paymentService.verifyPayment(request, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, result, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }
}