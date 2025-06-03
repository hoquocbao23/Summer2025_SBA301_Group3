package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @PostMapping("promotion")
    public ResponseApi<?> createPromotion( @Valid @RequestBody PromotionRequestDto promotionRequestDto) throws BadRequestException {
        promotionService.createPromotion(promotionRequestDto);
        return ResponseApi
                .builder()
                .status(HttpStatus.CREATED.value())
                .message(HttpStatus.CREATED.getReasonPhrase())
                .build();
    }
    @GetMapping("promotions")
    public ResponseApi<?> findAll(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "5") int size) {
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(promotionService.findAll(page, size))
                .build();
    }

    @GetMapping("promotion/{id}")
    public ResponseApi<?> findById(@PathVariable long id) {
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(promotionService.findById(id))
                .build();
    }

}
