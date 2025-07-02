package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Booking;
import com.sba301.metro_system.entity.Ticket;

public class BookingMapper {
    public static BookingResponseDto toBookingResponseDto(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingResponseDto dto = new BookingResponseDto();

        dto.setBookingId(booking.getBookingId());
        // Account -> userName
        if (booking.getAccount() != null) {
            dto.setUserName(booking.getAccount().getFullname()); // hoặc getUsername()
        }

        // Station
        if (booking.getDepartureStation() != null) {
            dto.setDepartureStation(booking.getDepartureStation().getStationName());
        }

        if (booking.getArrivalStation() != null) {
            dto.setArrivalStation(booking.getArrivalStation().getStationName());
        }

        // Giá vé
        dto.setOldPrice(booking.getOldPrice());
        dto.setNewPrice(booking.getNewPrice());

        // Thời gian mua
        dto.setPurchaseTime(booking.getPurchaseTime());

        // Vé -> loại vé
        if (booking.getTicketType() != null) {
            dto.setTicketName(booking.getTicketType().getTicketName());
        }

        // Promotion
        if (booking.getPromotion() != null) {
            dto.setPromotionCode(booking.getPromotion().getPromotionCode());
        }

        // Tuyến
        if (booking.getRoute() != null) {
            dto.setRouteName(booking.getRoute().getRouteName());
        }

        // QR / link thanh toán
        dto.setUrlCheckout(booking.getQrUrl());

        // Giả lập mã thanh toán (có thể là ID giao dịch bên thứ ba)
        dto.setPayOrderCode(booking.getBookingId()); // Hoặc field riêng nếu có

        // Số vé đã đặt
        if (booking.getTickets() != null) {
            dto.setNumberOfPassengers(booking.getTickets().size());
        } else {
            dto.setNumberOfPassengers(0);
        }

        return dto;

    }
}
