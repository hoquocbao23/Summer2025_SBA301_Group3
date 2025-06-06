package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findPromotionByPromotionIdAndStatus(Long id, Status status);
}
