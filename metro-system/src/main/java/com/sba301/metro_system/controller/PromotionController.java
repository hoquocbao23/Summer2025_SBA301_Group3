package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.promotion.PromotionRequestDto;
import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.service.IPromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@Tag(name = "Promotion")
public class PromotionController {
    private final IPromotionService promotionService;


    @PostMapping("promotion")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    content = @Content(schema = @Schema(implementation = Promotion.class))
            )
    })
    public ResponseApi<?> createPromotion(@Valid @RequestBody PromotionRequestDto promotionRequestDto) throws BadRequestException {
        return ResponseApi
                .builder()
                .status(HttpStatus.CREATED.value())
                .message(HttpStatus.CREATED.getReasonPhrase())
                .data(promotionService.createPromotion(promotionRequestDto))
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
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    content = @Content(schema = @Schema(implementation = Promotion.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Promotion not found"
            )

    })
    public ResponseApi<?> findById(@PathVariable long id) {
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(promotionService.findById(id))
                .build();
    }

    @PatchMapping("promotion/{id}")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Promotion not found"
            )
    })
    public ResponseApi<?> updatePromotion(@Valid @PathVariable long id,
                                          @RequestBody PromotionRequestDto promotionRequestDto) {
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message("Update success")
                .data(promotionService.updatePromotion(id, promotionRequestDto))
                .build();
    }

    @DeleteMapping("promotion/{id}")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Promotion not found"
            )
    })
    public ResponseApi<?> deletePromotion(@PathVariable long id) {
        promotionService.deletePromotion(id);
        return ResponseApi
                .builder()
                .status(HttpStatus.OK.value())
                .message("Delete success")
                .build();
    }


}
