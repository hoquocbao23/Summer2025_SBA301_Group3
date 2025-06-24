package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.TicketRule;
import com.sba301.metro_system.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRuleRepository extends JpaRepository<TicketRule, Long> {
    
    /**
     * Find ticket rule by name
     */
    Optional<TicketRule> findByRuleName(String ruleName);
    
    /**
     * Find all active ticket rules (not deleted)
     */
    List<TicketRule> findByIsDeleteFalse();
    
    /**
     * Find ticket rules by status
     */
    List<TicketRule> findByStatusAndIsDeleteFalse(Status status);
    
    /**
     * Find ticket rules by name containing keyword (case insensitive)
     */
    @Query("SELECT tr FROM TicketRule tr WHERE LOWER(tr.ruleName) LIKE LOWER(CONCAT('%', :keyword, '%')) AND tr.isDelete = false")
    List<TicketRule> findByRuleNameContaining(@Param("keyword") String keyword);
    
    /**
     * Check if rule name exists
     */
    boolean existsByRuleName(String ruleName);
    
    /**
     * Check if rule name exists for different rule ID (for update validation)
     */
    @Query("SELECT COUNT(tr) > 0 FROM TicketRule tr WHERE tr.ruleName = :ruleName AND tr.ruleId != :ruleId")
    boolean existsByRuleNameAndRuleIdNot(@Param("ruleName") String ruleName, @Param("ruleId") Long ruleId);
    
    /**
     * Find ticket rules by base price range
     */
    @Query("SELECT tr FROM TicketRule tr WHERE tr.basePrice BETWEEN :minPrice AND :maxPrice AND tr.isDelete = false")
    List<TicketRule> findByBasePriceBetween(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    /**
     * Find ticket rules by price per km range
     */
    @Query("SELECT tr FROM TicketRule tr WHERE tr.pricePerKm BETWEEN :minPricePerKm AND :maxPricePerKm AND tr.isDelete = false")
    List<TicketRule> findByPricePerKmBetween(@Param("minPricePerKm") Double minPricePerKm, @Param("maxPricePerKm") Double maxPricePerKm);
    
    /**
     * Find the most expensive ticket rule
     */
    @Query("SELECT tr FROM TicketRule tr WHERE tr.isDelete = false ORDER BY tr.basePrice DESC")
    List<TicketRule> findByOrderByBasePriceDesc();
    
    /**
     * Find the cheapest ticket rule
     */
    @Query("SELECT tr FROM TicketRule tr WHERE tr.isDelete = false ORDER BY tr.basePrice ASC")
    List<TicketRule> findByOrderByBasePriceAsc();
}
