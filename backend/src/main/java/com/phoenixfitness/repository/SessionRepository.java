package com.phoenixfitness.repository;

import com.phoenixfitness.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    
    List<Session> findByInstructorName(String instructorName);
    
    List<Session> findByStatus(Session.SessionStatus status);
    
    @Query("SELECT s FROM Session s WHERE s.scheduledDate >= :date ORDER BY s.scheduledDate ASC")
    List<Session> findUpcomingSessions(@Param("date") LocalDateTime date);
    
    @Query("SELECT s FROM Session s WHERE s.scheduledDate BETWEEN :startDate AND :endDate")
    List<Session> findSessionsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT s FROM Session s WHERE s.currentParticipants < s.maxParticipants AND s.status = 'SCHEDULED'")
    List<Session> findAvailableSessions();
    
    @Query("SELECT s FROM Session s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.instructorName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Session> findByTitleOrInstructorContaining(@Param("search") String search);
}