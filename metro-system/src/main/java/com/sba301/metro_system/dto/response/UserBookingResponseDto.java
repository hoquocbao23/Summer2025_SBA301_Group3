package com.sba301.metro_system.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserBookingResponseDto {
    private Long bookingId;
    private String userName;
    private StationInfo departureStation;
    private StationInfo arrivalStation;
    private RouteInfo route;
    private Double oldPrice;
    private Double newPrice;
    private LocalDateTime purchaseTime;
    private String ticketName;
    private String promotionCode;
    private String urlCheckout;
    private Long payOrderCode;
    private int numberOfPassengers;
    private List<TicketInfo> tickets;

    @Data
    public static class StationInfo {
        private Long stationId;
        private String stationName;
        private String stationLocation;
        private String description;
    }

    @Data
    public static class RouteInfo {
        private Long routeId;
        private String routeName;
        private String description;
        private Double distance;
    }

    @Data
    public static class TicketInfo {
        private Long ticketId;
        private String ticketCode;
        private LocalDateTime validFrom;
        private LocalDateTime validTo;
        private String status;
    }
}
