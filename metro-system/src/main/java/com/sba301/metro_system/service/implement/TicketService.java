package com.sba301.metro_system.service.implement;

import com.google.zxing.WriterException;
import com.sba301.metro_system.dto.request.payment.PaymentRequestDto;
import com.sba301.metro_system.dto.request.ticket.TicketRequestDto;
import com.sba301.metro_system.dto.request.transaction.TransactionRequestDto;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.*;
import com.sba301.metro_system.enums.PaymentMethod;
import com.sba301.metro_system.enums.TicketStatus;
import com.sba301.metro_system.enums.TransactionStatus;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.exception.UnAuthorized;
import com.sba301.metro_system.mapper.BookingMapper;
import com.sba301.metro_system.mapper.TicketMapper;
import com.sba301.metro_system.mapper.TransactionMapper;
import com.sba301.metro_system.record.MailBody;
import com.sba301.metro_system.repository.BookingRepository;
import com.sba301.metro_system.repository.RouteRepository;
import com.sba301.metro_system.repository.TicketRepository;
import com.sba301.metro_system.service.ITicketService;
import com.sba301.metro_system.utils.AccountHelper;
import com.sba301.metro_system.utils.Utils;
import jakarta.annotation.PostConstruct;
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


import java.time.LocalDateTime;

import java.util.*;
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
    private final StationService stationService;
    private final RouteRepository routeRepository;
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    @Value("${CHECK_IN}")
    private String CHECK_IN_URL;


    @Override
    public TicketResponseDto getTicketDetails(long ticketId)  {
        Ticket ticket = ticketRepository.findById(ticketId).get();
        return TicketMapper.toTicketResponseDto(ticket);
    }


    /**
     * Use HashMap to save ticket id with user email
     */
    private HashMap<Long, String> userEmailMap = new HashMap<>();

    @Override
    @Transactional

    public List<Ticket> buyOneTimeTicket(TicketRequestDto ticketRequestDto, Booking booking) {
        // Check ticket type
        TicketType ticketType = ticketTypeService.findById(ticketRequestDto.getTicketTypeId());

        // Check station
        Station departStation = stationService.findStationById(ticketRequestDto.getDepartureStation());
        Station arriveStation = stationService.findStationById(ticketRequestDto.getArrivalStation());


        int numOfPass = ticketRequestDto.getNumberOfPassengers();


        // clear Map before put new data
        if (!userEmailMap.isEmpty()){
            userEmailMap.clear();
        }
        List<Ticket> ticketList = new ArrayList();
        List<String> userEmails = ticketRequestDto.getUserEmails();
        
        for (int i = 0; i < numOfPass; i++) {
            Ticket ticket = new Ticket();
            Long ticketId = Utils.generateRandomId();
            ticket.setTicketId(ticketId);
            ticket.setDepartureStation(departStation);
            ticket.setArrivalStation(arriveStation);
            ticket.setValidFrom(null);
            ticket.setValidTo(null);
            ticket.setPurchaseTime(LocalDateTime.now());
            ticket.setTicketStatus(TicketStatus.PENDING);

            ticket.setTicketType(ticketType);
            //ticket.setRoute(routeRule.getRoute());
            ticket.setIsCheckin(false);
            ticket.setBooking(booking);

            // put key ticketID with userEmail value
            userEmailMap.put(ticketId, userEmails.get(i));
            
            ticketList.add(ticket);
        }
        return ticketList;


    }

    @Override
    @Transactional
    public Ticket buyUnlimitTicket(TicketRequestDto ticketRequestDto, Booking booking) {

        Account currentAccount = AccountHelper.getCurrentUser().getUser();
        if (currentAccount == null) {
            throw new UnAuthorized("Login before to use this service");
        }

        TicketType ticketType = ticketTypeService.findById(ticketRequestDto.getTicketTypeId());
        RouteRule routeRule = routeRuleService.findByRouteIdAndType(ticketRequestDto.getRouteId(),
                ticketType.getTicketTypeId());
        if (routeRule == null) {
            throw new NotFoundException("This ticket type does not apply to this route");
        }
        if (!userEmailMap.isEmpty()){
            userEmailMap.clear();
        }

        Ticket ticket = new Ticket();
        Long ticketId = Utils.generateRandomId();
        ticket.setTicketId(ticketId);
        ticket.setDepartureStation(null);
        ticket.setArrivalStation(null);
        ticket.setValidFrom(null);
        ticket.setValidTo(null);
        ticket.setPurchaseTime(LocalDateTime.now());
        ticket.setTicketStatus(TicketStatus.PENDING);

        ticket.setTicketType(ticketType);
        ticket.setRoute(routeRule.getRoute());
        ticket.setIsCheckin(false);
        ticket.setBooking(booking);
        userEmailMap.put(ticketId, ticketRequestDto.getUserEmails().get(0));
        return ticket;


    }


    @Override
    @Transactional
    public BookingResponseDto buyTicket(TicketRequestDto ticketRequestDto) throws Exception {

        Account currentAccount = AccountHelper.getCurrentUser().getUser();
        if (currentAccount == null) {
            throw new UnAuthorized("Login before to use this service");
        }
        int numOfPass = ticketRequestDto.getNumberOfPassengers();

        TicketType ticketType = ticketTypeService.findById(ticketRequestDto.getTicketTypeId());


        Booking newBooking = new Booking();
        newBooking.setAccount(currentAccount);

        newBooking.setTicketType(ticketType);


        Optional<Route> route = routeRepository.findById(ticketRequestDto.getRouteId());
        if (route.isPresent()) {
                newBooking.setRoute(route.get());
        }

        newBooking.setPurchaseTime(LocalDateTime.now());
        newBooking.setPaymentStatus(TransactionStatus.PENDING);
        newBooking.setPaymentMethod(PaymentMethod.PAYOS);

        if (ticketRequestDto.getPromotionCode() != null) {
            Promotion promotion = promotionService.findByCode(ticketRequestDto.getPromotionCode());
            if (promotion != null) {
                newBooking.setPromotion(promotion);
            }
        }

        Double oldPrice = ticketRequestDto.getTotal();
        newBooking.setOldPrice(oldPrice);

        Double newPrice = ticketRequestDto.getPaymentAmount();
        newBooking.setNewPrice(newPrice);


        if (ticketType.getUsageLimit()){
            Station departStation = stationService.findStationById(ticketRequestDto.getDepartureStation());
            Station arriveStation = stationService.findStationById(ticketRequestDto.getArrivalStation());
            newBooking.setDepartureStation(departStation);
            newBooking.setArrivalStation(arriveStation);
            bookingService.createBooking(newBooking);
            List<Ticket> buyTicket = buyOneTimeTicket(ticketRequestDto, newBooking);
            ticketRepository.saveAll(buyTicket);

        }else {
            Ticket buyTicket =  this.buyUnlimitTicket(ticketRequestDto, newBooking);
            bookingService.createBooking(newBooking);
            ticketRepository.save(buyTicket);

        }
        System.out.println(userEmailMap);

        CheckoutResponseData checkOut = paymentTicket(ticketType.getTicketName(),
                generateDescription(ticketType.getTicketName()),
                newPrice,
                numOfPass);

        BookingResponseDto responseDto = BookingMapper.toBookingResponseDto(newBooking);
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
    public void paymentTicketSuccess(long bookingId, Model model, TicketResponseDto ticketDto) throws Exception {
        Booking booking = bookingService.getBookingById(bookingId);
        booking.setPaymentStatus(TransactionStatus.SUCCESS);
        bookingRepository.save(booking);
        //update if payment success
        List<Ticket> bookingTickets = booking.getTickets();
        // update ticket status
        bookingTickets.stream().forEach(ticket -> {
            ticket.setTicketStatus(TicketStatus.UNUSED);
            ticketRepository.save(ticket);
        });

        PaymentLinkData paymentInfor = paymentService.getPaymentInform(ticketDto.getPayOrderCode());

        TransactionRequestDto transactionRequestDto = new TransactionRequestDto();
        transactionRequestDto.setBookingId(bookingId);
        transactionRequestDto.setPaymentMethod(PaymentMethod.PAYOS);
        transactionRequestDto.setTransactionStatus(TransactionStatus.SUCCESS);
        transactionRequestDto.setPayOrderId(ticketDto.getPayOrderCode());
        transactionRequestDto.setCounterAccountName(paymentInfor.getTransactions().get(0).getCounterAccountName());
        transactionRequestDto.setCounterAccountNumber(paymentInfor.getTransactions().get(0).getCounterAccountNumber());
        transactionRequestDto.setCounterAccountBankId(paymentInfor.getTransactions().get(0).getCounterAccountBankId());
        transactionService.saveTransaction(transactionRequestDto, booking);



        userEmailMap.forEach((ticketId, userEmail) -> {
            model.addAttribute("ticketId", ticketId);
            model.addAttribute("userEmail", userEmail);
            model.addAttribute("ticketDetailsUrl", CHECK_IN_URL+"/"+ ticketId);
            MailBody mailBody = MailBody.builder()
                    .to(userEmail)
                    .subject("Bạn đã mua " + booking.getTicketType().getTicketName())
                    .templateName("buy-ticket.html")
                    .build();
            emailService.sendEmail(mailBody, model);
        });

        }



    @Transactional
    @Override
    public void paymentTicketFail(long bookingId, Model model) throws Exception {
        Booking booking = bookingService.getBookingById(bookingId);
        booking.setPaymentStatus(TransactionStatus.FAILED);
        bookingRepository.save(booking);

        //update if payment failed
        List<Ticket> bookingTickets = booking.getTickets();
        // update ticket status
        bookingTickets.stream().forEach(ticket -> {
            ticket.setTicketStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
        });

        // create new transaction
        TransactionRequestDto transactionRequestDto = TransactionMapper.getTransactionRequestDto(bookingId,
                PaymentMethod.PAYOS,
                TransactionStatus.FAILED);
        transactionService.saveTransaction(transactionRequestDto, booking);

    }

    @Override
    public boolean checkUnusedTicket(long ticketTypeId) {
//        Account currentAccount = AccountHelper.getCurrentUser().getUser();
//        return ticketRepository.existsTicket(currentAccount,
//                ticketTypeId,
//                TicketStatus.UNUSED);
        return false;
    }

    @Override
    public List<TicketResponseDto> getUserTickets() {
//        Account currentAccount = AccountHelper.getCurrentUser().getUser();
//        List<Ticket> tickets = ticketRepository.findTicketByAccount(currentAccount);
//        return tickets
//                .stream()
//                .map(TicketMapper::toTicketResponseDto)
//                .collect(Collectors.toList());
        return null;
    }

    @Override
    public Page<TicketResponseDto> getAllTickets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        return ticketPage.map(TicketMapper::toTicketResponseDto);
    }

//    @Scheduled(fixedRate = 60 * 60 * 1000)
//    public void checkExpiredTicket() {
//        LocalDateTime now = LocalDateTime.now();
//        int updatedCount = ticketRepository.markTicketsAsExpired(now);
//        System.out.println("Expired tickets updated: " + updatedCount + " at: " + now);
//    }

    Ticket findTicketById(long ticketId) {
        return ticketRepository.findById(ticketId).orElse(null);
    }






}
