package com.sba301.metro_system.exception;

public class TicketRuleException extends RuntimeException {
    public TicketRuleException(String message) {
        super(message);
    }

    public TicketRuleException(String message, Throwable cause) {
        super(message, cause);
    }
}

class TicketRuleNotFoundException extends TicketRuleException {
    public TicketRuleNotFoundException(String message) {
        super(message);
    }
}

class TicketRuleAlreadyExistsException extends TicketRuleException {
    public TicketRuleAlreadyExistsException(String message) {
        super(message);
    }
}

class TicketRuleDeletedStateException extends TicketRuleException {
    public TicketRuleDeletedStateException(String message) {
        super(message);
    }
}

class InvalidPriceCalculationException extends TicketRuleException {
    public InvalidPriceCalculationException(String message) {
        super(message);
    }
}

class TicketRuleInactiveException extends TicketRuleException {
    public TicketRuleInactiveException(String message) {
        super(message);
    }
}
