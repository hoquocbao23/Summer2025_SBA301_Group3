package com.sba301.metro_system.exception;

public class UnAuthorized extends RuntimeException {
    public UnAuthorized(String message) {
        super(message);
    }
}
