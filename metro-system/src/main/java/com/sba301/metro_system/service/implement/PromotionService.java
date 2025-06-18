package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.dto.response.TicketTypeResponseDto;
import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.PromotionRepository;
import com.sba301.metro_system.service.IPromotionService;
import com.sba301.metro_system.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {
    private final PromotionRepository promotionRepository;
    private final TicketTypeService ticketTypeService;


    @Override
    public Promotion createPromotion(PromotionRequestDto promotionRequestDto) throws BadRequestException {
        Promotion promotion = new Promotion();

        promotion.setPromotionCode(promotionRequestDto.getPromotionCode());
        promotion.setPromotionName(promotionRequestDto.getPromotionName());
        promotion.setPromotionDiscount(promotionRequestDto.getPromotionDiscount());

        if (isValidDate(promotionRequestDto.getFromDate(), promotionRequestDto.getToDate())) {
            promotion.setFromDate(promotionRequestDto.getFromDate());
            promotion.setToDate(promotionRequestDto.getToDate());
        }

        promotion.setStatus(promotionRequestDto.getStatus());
        if (promotionRequestDto.getTicketTypeId() != null) {
            TicketType ticketType = ticketTypeService.findById(promotionRequestDto.getTicketTypeId());
            promotion.setTicketType(ticketType);
        }
        promotionRepository.save(promotion);

        return promotion;
    }

    public boolean isValidDate(LocalDateTime fromDate, LocalDateTime toDate) throws BadRequestException {
        LocalDateTime now = LocalDateTime.now();
        if (fromDate.isBefore(now) || toDate.isBefore(now)) {
            throw new BadRequestException("Start date or end date should be greater than now");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BadRequestException("Start date cannot be greater than end date");
        }
        return true;
    }

    @Override
    public Page<Promotion> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return promotionRepository.findAll(pageable);
    }

    @Override
    public Promotion findById(long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));
    }

    @Override
    public Promotion updatePromotion(long id, PromotionRequestDto promotionRequestDto) throws BadRequestException {
        Promotion existPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));

        if (Utils.validateString(promotionRequestDto.getPromotionName())) {
            existPromotion.setPromotionName(promotionRequestDto.getPromotionName());
        }

        if (Utils.validateString(promotionRequestDto.getPromotionCode())) {
            existPromotion.setPromotionCode(promotionRequestDto.getPromotionCode());
        }

        if (promotionRequestDto.getPromotionDiscount() != null && promotionRequestDto.getPromotionDiscount().intValue() > 0 ) {
            existPromotion.setPromotionDiscount(promotionRequestDto.getPromotionDiscount());
        }

        if (isValidDate(promotionRequestDto.getFromDate(), promotionRequestDto.getToDate())) {
            existPromotion.setFromDate(promotionRequestDto.getFromDate());
            existPromotion.setToDate(promotionRequestDto.getToDate());
        }

        Utils.updateIfNotEqual(promotionRequestDto.getStatus(), existPromotion.getStatus(),
                existPromotion::setStatus);

        if (promotionRequestDto.getTicketTypeId() != null ) {
            existPromotion.setTicketType(ticketTypeService.findById(promotionRequestDto.getTicketTypeId()));
        }

        return promotionRepository.save(existPromotion);

    }

    @Override
    public void deletePromotion(long id) {
        Promotion existPromotion = promotionRepository.findPromotionByPromotionIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));
        existPromotion.setStatus(Status.INACTIVE);
        promotionRepository.save(existPromotion);
    }

    @Override
    public List<Promotion> findAvailablePromotions(long ticketTypeId) {
        return null;
    }

    @Override
    public Promotion findByCode(String promotionCode) {
        return promotionRepository.findPromotionByPromotionCodeAndStatus(promotionCode, Status.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));

    }


}
