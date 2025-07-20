package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findPromotionByPromotionIdAndStatus(Long id, Status status);
    Optional<Promotion> findPromotionByPromotionCodeAndStatus(String promotionCode, Status status);
    Optional<Promotion> findPromotionByPromotionCodeAndTicketTypeAndStatus(String promotionCode, TicketType ticketType, Status status);

}