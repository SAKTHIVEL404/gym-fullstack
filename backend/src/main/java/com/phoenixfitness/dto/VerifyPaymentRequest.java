package com.phoenixfitness.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyPaymentRequest {
    
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    private String signature;

    // Constructors
    public VerifyPaymentRequest() {}

    public VerifyPaymentRequest(String paymentId, String orderId, String signature) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.signature = signature;
    }

    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }
}