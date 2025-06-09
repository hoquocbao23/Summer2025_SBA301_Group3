//package com.sba301.metro_system.service.implement;
//
//import com.sba301.metro_system.entity.Promotion;
//import com.sba301.metro_system.entity.TicketType;
//import com.sba301.metro_system.entity.TicketTypePromotion;
//import com.sba301.metro_system.repository.PromotionRepository;
//import com.sba301.metro_system.repository.TicketTypePromotionRepository;
//import com.sba301.metro_system.service.ITicketTypePromotionService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//
//
//@Service
//@RequiredArgsConstructor
//public class TicketTypePromotionService implements ITicketTypePromotionService {
//    private final TicketTypePromotionRepository ticketTypePromotionRepository;
//    private final TicketTypeService ticketTypeService;
//
//    @Override
//    public void saveTicketTypePromotion(Promotion promotion, List<Long> ticketTypeIds) {
//        List<TicketType> ticketTypes = ticketTypeService.findAllByTicketTypeId(ticketTypeIds);
//
//        List<TicketTypePromotion> ticketTypePromotionList = ticketTypes
//                .stream()
//                .map(ticketType -> {
//                    TicketTypePromotion ttp = new TicketTypePromotion();
//                    ttp.setPromotion(promotion);
//                    ttp.setTicketType(ticketType);
//                    return ttp;
//                })
//                .toList();
//
//        ticketTypePromotionRepository.saveAll(ticketTypePromotionList);
//    }
//}
