package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface IPromotionService {
    void createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException;
    Page<Promotion> findAll(int page, int size);
    Optional<Promotion> findById(long id);
}
