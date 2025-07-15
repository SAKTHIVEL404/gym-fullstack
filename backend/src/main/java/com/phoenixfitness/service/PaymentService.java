package com.phoenixfitness.service;

import com.phoenixfitness.dto.CreateOrderRequest;
import com.phoenixfitness.dto.VerifyPaymentRequest;
import com.phoenixfitness.entity.Session;
import com.phoenixfitness.entity.User;
import com.phoenixfitness.repository.SessionRepository;
import com.phoenixfitness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> createOrder(CreateOrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Session session = sessionRepository.findById(request.getSessionId())
            .orElseThrow(() -> new RuntimeException("Session not found"));

        // In a real implementation, you would integrate with a payment gateway like Razorpay or Stripe
        // For demo purposes, we'll create a mock order
        String orderId = "order_" + UUID.randomUUID().toString().substring(0, 8);

        Map<String, Object> orderData = new HashMap<>();
        orderData.put("orderId", orderId);
        orderData.put("amount", request.getAmount());
        orderData.put("currency", request.getCurrency());
        orderData.put("sessionId", session.getId());
        orderData.put("sessionTitle", session.getTitle());
        orderData.put("userEmail", user.getEmail());

        return orderData;
    }

    public String verifyPayment(VerifyPaymentRequest request, String userEmail) {
        // In a real implementation, you would verify the payment with the payment gateway
        // For demo purposes, we'll assume the payment is successful
        
        // You would typically:
        // 1. Verify the payment signature
        // 2. Check the payment status with the payment gateway
        // 3. Update the booking status accordingly

        return "Payment verified successfully";
    }
}