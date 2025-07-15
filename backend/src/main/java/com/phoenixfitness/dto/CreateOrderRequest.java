package com.phoenixfitness.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class CreateOrderRequest {
    
    @NotNull(message = "Session ID is required")
    private Long sessionId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String currency = "INR";

    // Constructors
    public CreateOrderRequest() {}

    public CreateOrderRequest(Long sessionId, BigDecimal amount, String currency) {
        this.sessionId = sessionId;
        this.amount = amount;
        this.currency = currency;
    }

    // Getters and Setters
    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}