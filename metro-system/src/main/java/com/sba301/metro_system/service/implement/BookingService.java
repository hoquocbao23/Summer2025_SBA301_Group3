package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.request.route.RouteRequest;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.Booking;
import com.sba301.metro_system.mapper.BookingMapper;
import com.sba301.metro_system.repository.BookingRepository;
import com.sba301.metro_system.service.IBookingService;
import com.sba301.metro_system.utils.AccountHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
