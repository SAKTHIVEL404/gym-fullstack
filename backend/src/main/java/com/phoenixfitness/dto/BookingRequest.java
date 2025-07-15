package com.phoenixfitness.dto;

public class BookingRequest {
    
    private String notes;
    private String paymentId;
    private String orderId;
    private String paymentMethod;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(String notes, String paymentId, String orderId, String paymentMethod) {
        this.notes = notes;
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}