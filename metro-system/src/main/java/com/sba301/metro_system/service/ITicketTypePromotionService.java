package com.sba301.metro_system.service;

import com.sba301.metro_system.entity.Promotion;
import com.sba301.metro_system.entity.TicketTypePromotion;

import java.util.List;

public interface ITicketTypePromotionService {
    void saveTicketTypePromotion(Promotion promotion, List<Long>ticketTypeIds);
}
