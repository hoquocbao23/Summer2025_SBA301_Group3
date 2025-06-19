package com.sba301.metro_system.exception;

import com.sba301.metro_system.dto.ResponseApi;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseApi<?> handleBadRequestException(BadRequestException e) {
        return ResponseApi
                .builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(e.getMessage())
                .build();

    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseApi<?> handleNotFoundException(NotFoundException e) {
        return ResponseApi
                .builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(e.getMessage())
                .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseApi<?> handleNotValidException(MethodArgumentNotValidException e) {
        return ResponseApi
                .builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(e.getFieldError().getDefaultMessage())
                .build();
    }

    @ExceptionHandler(UnAuthorized.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseApi<?> handleNotValidException(UnAuthorized e) {
        return ResponseApi
                .builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(e.getMessage())
                .build();
    }

}
