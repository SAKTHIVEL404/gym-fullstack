package com.phoenixfitness.service;

import com.phoenixfitness.dto.BookingRequest;
import com.phoenixfitness.dto.SessionRequest;
import com.phoenixfitness.entity.Booking;
import com.phoenixfitness.entity.Session;
import com.phoenixfitness.entity.User;
import com.phoenixfitness.repository.BookingRepository;
import com.phoenixfitness.repository.SessionRepository;
import com.phoenixfitness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Session getSessionById(Long id) {
        return sessionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public List<Session> getUpcomingSessions() {
        return sessionRepository.findUpcomingSessions(LocalDateTime.now());
    }

    @Transactional
    public Booking bookSession(Long sessionId, BookingRequest request, String userEmail) {
        Session session = getSessionById(sessionId);
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if session is available
        if (session.getCurrentParticipants() >= session.getMaxParticipants()) {
            throw new RuntimeException("Session is fully booked");
        }

        // Check if user already booked this session
        if (bookingRepository.findByUserAndSession(user, session).isPresent()) {
            throw new RuntimeException("You have already booked this session");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSession(session);
        booking.setAmount(session.getPrice());
        booking.setNotes(request.getNotes());
        booking.setPaymentId(request.getPaymentId());
        booking.setOrderId(request.getOrderId());
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setMeetLink(session.getMeetLink());

        // Update session participant count
        session.setCurrentParticipants(session.getCurrentParticipants() + 1);
        sessionRepository.save(session);

        return bookingRepository.save(booking);
    }

    public Session createSession(SessionRequest request) {
        Session session = new Session();
        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setInstructorName(request.getInstructorName());
        session.setScheduledDate(request.getScheduledDate());
        session.setDuration(request.getDuration());
        session.setMaxParticipants(request.getMaxParticipants());
        session.setPrice(request.getPrice());
        session.setImageUrl(request.getImageUrl());
        session.setMeetLink(request.getMeetLink());
        session.setStatus(Session.SessionStatus.SCHEDULED);

        return sessionRepository.save(session);
    }

    public Session updateSession(Long id, SessionRequest request) {
        Session session = getSessionById(id);

        session.setTitle(request.getTitle());
        session.setDescription(request.getDescription());
        session.setInstructorName(request.getInstructorName());
        session.setScheduledDate(request.getScheduledDate());
        session.setDuration(request.getDuration());
        session.setMaxParticipants(request.getMaxParticipants());
        session.setPrice(request.getPrice());
        session.setImageUrl(request.getImageUrl());
        session.setMeetLink(request.getMeetLink());

        return sessionRepository.save(session);
    }

    public void deleteSession(Long id) {
        Session session = getSessionById(id);
        sessionRepository.delete(session);
    }
}