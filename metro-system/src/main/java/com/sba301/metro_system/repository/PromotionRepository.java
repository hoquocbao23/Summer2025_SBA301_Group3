package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
@Repository
=======
import java.util.Optional;

>>>>>>> b50d37988353efb3012b7a83fba547f1341e2080
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findPromotionByPromotionIdAndStatus(Long id, Status status);
}
