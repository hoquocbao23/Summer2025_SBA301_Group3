package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.repository.PromotionRepository;
import com.sba301.metro_system.service.IPromotionService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {
    private final PromotionRepository promotionRepository;

    public void createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException {
        Promotion promotion = new Promotion();
        promotion.setPromotionCode(promotionRequestDto.getPromotionCode());
        promotion.setPromotionDiscount(promotionRequestDto.getPromotionDiscount());

        if (isValidDate(promotionRequestDto.getFromDate(), promotionRequestDto.getToDate())) {
            promotion.setFromDate(promotionRequestDto.getFromDate());
            promotion.setToDate(promotionRequestDto.getToDate());
        }
        promotion.setStatus(promotionRequestDto.getStatus());
        promotionRepository.save(promotion);
    }

    public boolean isValidDate(LocalDateTime fromDate, LocalDateTime toDate) throws BadRequestException {
        LocalDateTime now = LocalDateTime.now();
        if (fromDate.isBefore(now) || toDate.isBefore(now)) {
            throw new BadRequestException("Ngày bắt đầu hoặc kết thúc không được nhỏ hơn ngày hiện tại.");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BadRequestException("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
        }
        return true;
    }

    public Page<Promotion> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page , size);
        return promotionRepository.findAll(pageable);
    }

    public Optional<Promotion> findById(long id) {
        return promotionRepository.findById(id);
    }

}
