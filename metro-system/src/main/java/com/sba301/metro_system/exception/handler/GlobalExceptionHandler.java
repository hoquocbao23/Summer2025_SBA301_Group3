package com.sba301.metro_system.exception.handler;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.exception.StationValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StationValidationException.class)
    public ResponseEntity<ResponseApi<String>> handleStationValidationException(
            StationValidationException ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation Error")
                .data(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseApi<String>> handleNotFoundException(
            NotFoundException ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("Resource Not Found")
                .data(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseApi<String>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Invalid Request")
                .data(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseApi<String>> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("Access Denied")
                .data("You don't have permission to access this resource")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseApi<String>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Internal Server Error")
                .data(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseApi<String>> handleGenericException(
            Exception ex, WebRequest request) {
        ResponseApi<String> errorResponse = ResponseApi.<String>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred")
                .data(ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
