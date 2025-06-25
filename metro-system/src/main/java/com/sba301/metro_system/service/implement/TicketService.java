package com.sba301.metro_system.service.implement;

import com.google.zxing.WriterException;
import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.dto.request.user.UserEmailDto;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentLinkData;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

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

    @Value("${CHECK_IN}")
    private String CHECK_IN_URL;


    @Override
    public TicketResponseDto getTicketDetails(long ticketId)  {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        return TicketMapper.toTicketResponseDto(ticket);
    }

    @Value("${CHECK_IN}")
    private String CHECK_IN;

    @Override
    @Transactional
    public TicketResponseDto buyUnlimitTicket(TicketRequestDto ticketRequestDto) throws Exception{
        System.out.println(ticketRequestDto);
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
            Promotion promotion = promotionService.findById(ticketRequestDto.getRouteId());
            if (promotion != null) {
                newPrice -= calculateDiscountedPrice(oldPrice, promotion);
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
        ticket.setIsCheckin(false);
        ticketRepository.save(ticket);
        // create payment qr
        CheckoutResponseData checkOut = paymentTicket(ticketType.getTicketName(),
                generateDescription(ticketType.getTicketName()),
                newPrice,
                NUMBER_OF_TICKETS);

        TicketResponseDto responseDto = TicketMapper.toTicketResponseDto(ticket);
        responseDto.setUrlCheckout(checkOut.getCheckoutUrl());
        responseDto.setPayOrderCode(checkOut.getOrderCode());

        return responseDto;
    }



    public Double calculateDiscountedPrice(Double oldPrice, Promotion promotion) {
        if (promotion != null) {
            return oldPrice * (promotion.getPromotionDiscount().doubleValue() / 100);
        }
        return oldPrice;
    }


    @Transactional
    public CheckoutResponseData paymentTicket(String ticketName, String description, Double price, int quantity) throws Exception {
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

    @Transactional
    @Override
    public void paymentTicketSuccess(long ticketId, Model model, long orderId) throws Exception {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        //update if payment success
        ticket.setTicketStatus(TicketStatus.UNUSED);
        ticketRepository.save(ticket);

        PaymentLinkData paymentInfor = paymentService.getPaymentInform(orderId);

        // create new transaction
//        TransactionRequestDto transactionRequestDto = TransactionMapper.getTransactionRequestDto(ticketId,
//                PaymentMethod.PAYOS,
//                TransactionStatus.SUCCESS);
        TransactionRequestDto transactionRequestDto = new TransactionRequestDto();
        transactionRequestDto.setTicketId(ticketId);
        transactionRequestDto.setPaymentMethod(PaymentMethod.PAYOS);
        transactionRequestDto.setTransactionStatus(TransactionStatus.SUCCESS);
        transactionRequestDto.setPayOrderId(orderId);
        transactionRequestDto.setCounterAccountName(paymentInfor.getTransactions().get(0).getCounterAccountName());
        transactionRequestDto.setCounterAccountNumber(paymentInfor.getTransactions().get(0).getCounterAccountNumber());
        transactionRequestDto.setCounterAccountBankId(paymentInfor.getTransactions().get(0).getCounterAccountBankId());
        transactionService.saveTransaction(transactionRequestDto, ticket);


        model.addAttribute("ticketId", ticketId);
        model.addAttribute("userName", ticket.getAccount().getFullname());
        //String qrCodeBase64 = emailService.generateQrCodeAsBase64(CHECK_IN+"/"+ticketId, 100, 100);
        model.addAttribute("ticketDetailsUrl", CHECK_IN_URL+"/"+ticketId);
        //  model.addAttribute("qrCode", "data:image/png;base64,"+qrCodeBase64);
        MailBody mailBody = MailBody.builder()
                .to(ticket.getAccount().getEmail())
                .subject("Bạn đã mua " + ticket.getTicketType().getTicketName())
                .templateName("buy-ticket.html")
                .build();
        emailService.sendEmail(mailBody, model);
    }

    @Transactional
    @Override
    public void paymentTicketFail(long ticketId, Model model) throws Exception {
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

    @Override
    public boolean checkUnusedTicket(long ticketTypeId) {
        Account currentAccount = AccountHelper.getCurrentUser().getUser();
        return ticketRepository.existsTicket(currentAccount,
                ticketTypeId,
                TicketStatus.UNUSED);
    }

    @Override
    public List<TicketResponseDto> getUserTickets() {
        Account currentAccount = AccountHelper.getCurrentUser().getUser();
        List<Ticket> tickets = ticketRepository.findTicketByAccount(currentAccount);
        return tickets
                .stream()
                .map(TicketMapper::toTicketResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TicketResponseDto> getAllTickets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        return ticketPage.map(TicketMapper::toTicketResponseDto);
    }


}
