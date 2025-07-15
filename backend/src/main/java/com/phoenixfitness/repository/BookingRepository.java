package com.phoenixfitness.repository;

import com.phoenixfitness.entity.Booking;
import com.phoenixfitness.entity.User;
import com.phoenixfitness.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findBySession(Session session);
    
    List<Booking> findBySessionId(Long sessionId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findUserBookingsOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.session.scheduledDate >= :date AND b.status = 'CONFIRMED'")
    List<Booking> findUpcomingConfirmedBookings(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.session.id = :sessionId AND b.status = 'CONFIRMED'")
    Long countConfirmedBookingsBySessionId(@Param("sessionId") Long sessionId);
    
    Optional<Booking> findByUserAndSession(User user, Session session);
    
    @Query("SELECT b FROM Booking b WHERE b.paymentId = :paymentId")
    Optional<Booking> findByPaymentId(@Param("paymentId") String paymentId);
    
    @Query("SELECT b FROM Booking b WHERE b.orderId = :orderId")
    Optional<Booking> findByOrderId(@Param("orderId") String orderId);
}