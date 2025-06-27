package com.sba301.metro_system.exception;

import lombok.Data;

@Data
public class CustomException extends RuntimeException {
    private String code;
    private String message;

    public CustomException(String code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
