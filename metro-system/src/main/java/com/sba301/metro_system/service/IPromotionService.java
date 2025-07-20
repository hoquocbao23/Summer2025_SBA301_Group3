package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.dto.response.PromotionResponseDto;
import com.sba301.metro_system.entity.Promotion;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IPromotionService {
    Promotion createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException;
    Page<Promotion> findAll(int page, int size);
    Promotion findById(long id);
    Promotion updatePromotion(long id, PromotionRequestDto promotionRequestDto) throws BadRequestException ;
    void deletePromotion(long id);
    List<PromotionResponseDto> findAvailablePromotions(long ticketTypeId );
    Promotion findByCode(String promotionCode);
    PromotionResponseDto isEligiblePromotion(String promotionCode, long ticketTypeId);

    List<PromotionResponseDto> getEligiblePromotion(long ticketTypeId);
}
