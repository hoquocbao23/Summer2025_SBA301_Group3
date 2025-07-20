package com.sba301.metro_system.exception;

/**
 * Custom exception for train validation errors
 */
public class TrainValidationException extends RuntimeException {

    public TrainValidationException(String message) {
        super(message);
    }

    public TrainValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
