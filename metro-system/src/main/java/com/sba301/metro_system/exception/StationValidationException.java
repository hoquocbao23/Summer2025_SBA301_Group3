package com.sba301.metro_system.exception;

/**
 * Custom exception for station validation errors
 */
public class StationValidationException extends RuntimeException {

    public StationValidationException(String message) {
        super(message);
    }

    public StationValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
