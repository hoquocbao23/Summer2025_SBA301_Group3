package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findPromotionByPromotionIdAndStatus(Long id, Status status);

    @Query(value = """
    SELECT DISTINCT p.*
    FROM promotion p
    JOIN ticket_type_promotion ttp ON p.promotion_id = ttp.promotion_id
    WHERE p.status = 'ACTIVE'
    AND ttp.ticket_type_id IN (:ticketTypeId)
    AND NOW() BETWEEN p.from_date AND p.to_date
""", nativeQuery = true)
    List<Promotion> findActivePromotionsByTicketTypeIds(@Param("ticketTypeId") long ticketTypeId);
}
