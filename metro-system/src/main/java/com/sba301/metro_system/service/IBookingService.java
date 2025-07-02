package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.entity.Booking;

public interface IBookingService {
    void createBooking(Booking booking);
}
