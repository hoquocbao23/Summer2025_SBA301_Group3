package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.entity.Booking;
import com.sba301.metro_system.repository.BookingRepository;
import com.sba301.metro_system.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;

    @Override
    public void createBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    public Booking getBookingById(long bookingId) {
        return bookingRepository.findById(bookingId).get();
    }

}
