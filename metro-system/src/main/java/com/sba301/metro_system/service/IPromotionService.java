package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;

public interface IPromotionService {
    Promotion createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException;
    Page<Promotion> findAll(int page, int size);
    Promotion findById(long id);
    Promotion updatePromotion(long id, PromotionRequestDto promotionRequestDto) ;
    void deletePromotion(long id);
}
