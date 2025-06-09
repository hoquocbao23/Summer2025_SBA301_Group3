package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Optional;

public interface IPromotionService {
    Promotion createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException;
    Page<Promotion> findAll(int page, int size);
    Promotion findById(long id);
    Promotion updatePromotion(long id, PromotionRequestDto promotionRequestDto) ;
    void deletePromotion(long id);
    List<Promotion> findAvailablePromotions(long ticketTypeId );

}
