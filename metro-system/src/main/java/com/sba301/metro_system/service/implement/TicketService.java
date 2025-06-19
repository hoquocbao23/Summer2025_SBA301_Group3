package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.*;
import com.sba301.metro_system.enums.PaymentMethod;
import com.sba301.metro_system.enums.TicketStatus;
import com.sba301.metro_system.enums.TransactionStatus;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.exception.UnAuthorized;
import com.sba301.metro_system.mapper.TicketMapper;
import com.sba301.metro_system.mapper.TransactionMapper;
import com.sba301.metro_system.record.MailBody;
import com.sba301.metro_system.repository.TicketRepository;
import com.sba301.metro_system.service.ITicketService;
import com.sba301.metro_system.utils.AccountHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketService implements ITicketService {
    private final TicketRepository ticketRepository;
    private final RouteRuleService routeRuleService;
    private final TicketTypeService ticketTypeService;
    private final PromotionService promotionService;
    private final PaymentService paymentService;
    private final TransactionService transactionService;
    private final EmailService emailService;


    @Override
    public TicketResponseDto getTicketDetails(long ticketId)  {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        return TicketMapper.toTicketResponseDto(ticket);
    }

    public TicketResponseDto buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception{
        final int NUMBER_OF_TICKETS = 1;
        Ticket ticket = new Ticket();
        Account currentAccount = AccountHelper.getCurrentUser().getUser();
        if (currentAccount == null) {
            throw new UnAuthorized("Login before to use this service");
        }

        TicketType ticketType = ticketTypeService.findById(ticketRequestDto.getTicketTypeId());
        RouteRule routeRule = routeRuleService.findByRouteIdAndType(ticketRequestDto.getRouteId(),
                ticketType.getTicketName());
        if (routeRule == null) {
            throw new NotFoundException("This ticket type does not apply to this route");
        }

        Double basePrice = routeRule.getTicketRule().getBasePrice();
        Double oldPrice = basePrice;
        Double newPrice = basePrice;

        if (ticketRequestDto.getPromotionCode() != null) {
            Promotion promotion = promotionService.findByCode(ticketRequestDto.getPromotionCode());
            if (promotion != null) {
                newPrice = calculateDiscountedPrice(oldPrice, promotion);
                ticket.setPromotion(promotion);
            }
        }
        ticket.setDepartureStation(null);
        ticket.setArrivalStation(null);
        ticket.setOldPrice(oldPrice);
        ticket.setNewPrice(newPrice);
        ticket.setValidFrom(null);
        ticket.setValidTo(null);
        ticket.setPurchaseTime(LocalDateTime.now());
        ticket.setTicketStatus(TicketStatus.PENDING);
        ticket.setAccount(currentAccount);
        ticket.setTicketType(ticketType);
        ticket.setRoute(routeRule.getRoute());
        ticketRepository.save(ticket);

        // create payment qr
        String urlCheckout = paymentTicket(ticketType.getTicketName(),
                generateDescription(ticketType.getTicketName()),
                newPrice,
                NUMBER_OF_TICKETS);

        TicketResponseDto responseDto = TicketMapper.toTicketResponseDto(ticket);
        responseDto.setUrlCheckout(urlCheckout);

        return responseDto;
    }



    public Double calculateDiscountedPrice(Double oldPrice, Promotion promotion) {
        if (promotion != null) {
            return oldPrice * (promotion.getPromotionDiscount().doubleValue() / 100);
        }
        return oldPrice;
    }

    public String paymentTicket(String ticketName,String description, Double price, int quantity) throws Exception {
        PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
        paymentRequestDto.setProductName(ticketName);
        paymentRequestDto.setDescription(description);
        paymentRequestDto.setPrice(price);
        paymentRequestDto.setQuantity(quantity);
        return paymentService.createCheckout(paymentRequestDto);
    }

    public String generateDescription(String ticketName){
        return String.format("Thanh toan mua %s", ticketName);
    }

    public void paymentTicketSuccess(long ticketId)  {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        //update if payment success
        ticket.setTicketStatus(TicketStatus.UNUSED);
        ticketRepository.save(ticket);

        // create new transaction
        TransactionRequestDto transactionRequestDto = TransactionMapper.getTransactionRequestDto(ticketId,
                PaymentMethod.PAYOS,
                TransactionStatus.SUCCESS);
        transactionService.saveTransaction(transactionRequestDto, ticket);

        String text = "Bạn đã mua vé " + ticket.getTicketType().getTicketName();
        MailBody mailBody = MailBody.builder()
                .to(ticket.getAccount().getEmail())
                .subject("Bạn đã mua vé" + ticket.getTicketType().getTicketName())
                .text(text)
                .build();
        emailService.sendOTP(mailBody);
    }

    public void paymentTicketFail(long ticketId)  {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        //update if payment failed
        ticket.setTicketStatus(TicketStatus.CANCELLED);
//        ticketRepository.save(ticket);

        // create new transaction
        TransactionRequestDto transactionRequestDto = TransactionMapper.getTransactionRequestDto(ticketId,
                PaymentMethod.PAYOS,
                TransactionStatus.FAILED);
        transactionService.saveTransaction(transactionRequestDto, ticket);
    }







}
