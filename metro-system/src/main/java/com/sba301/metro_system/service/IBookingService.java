package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Booking;

import java.util.List;

public interface IBookingService {
    void createBooking(Booking booking);

}
