package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.dto.response.TicketTypeResponseDto;
import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.entity.TicketType;
import com.sba301.metro_system.enums.Status;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.repository.PromotionRepository;
import com.sba301.metro_system.service.IPromotionService;
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
        if (toDate.isBefore(now)) {
            throw new BadRequestException("Ngày bắt đầu hoặc kết thúc không được nhỏ hơn ngày hiện tại.");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BadRequestException("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
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
    public Promotion updatePromotion(long id, PromotionRequestDto promotionRequestDto) {
        Promotion existPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Promotion not found"));

        if (promotionRequestDto.getPromotionName() != null) {
            existPromotion.setPromotionName(promotionRequestDto.getPromotionName());
        }

        if (promotionRequestDto.getPromotionCode() != null) {
            existPromotion.setPromotionCode(promotionRequestDto.getPromotionCode());
        }

        if (promotionRequestDto.getPromotionDiscount() != null &&
                !promotionRequestDto.getPromotionDiscount().equals(existPromotion.getPromotionDiscount())) {
            existPromotion.setPromotionDiscount(promotionRequestDto.getPromotionDiscount());
        }

        if (promotionRequestDto.getFromDate() != null &&
                !promotionRequestDto.getFromDate().equals(existPromotion.getFromDate())) {
            existPromotion.setFromDate(promotionRequestDto.getFromDate());
        }

        if (promotionRequestDto.getToDate() != null &&
                !promotionRequestDto.getToDate().equals(existPromotion.getToDate())) {
            existPromotion.setToDate(promotionRequestDto.getToDate());
        }

        if (promotionRequestDto.getStatus() != null &&
                !promotionRequestDto.getStatus().equals(existPromotion.getStatus())) {
            existPromotion.setStatus(promotionRequestDto.getStatus());
        }
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


}
