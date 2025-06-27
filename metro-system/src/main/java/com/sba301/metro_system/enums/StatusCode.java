package com.sba301.metro_system.enums;

import lombok.Data;


public enum StatusCode {
    SUCCESS("2000", "Success"),
    TICKET_NOT_CHECK_OUT("2002", "Check out before check in"),
    TICKET_NOT_CHECK_IN("2003", "Check in before check out"),
    TICKET_NOT_ACTIVE("2004", "Ticket not active"),
    TICKET_EXPIRED("2005", "Ticket has expired"),
    TICKET_NOT_FOUND("2006", "Ticket not found"),
    TICKET_BUY_FAILED("2007", "Ticket not available");

    private final String code;
    private final String message;

    StatusCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }


}
