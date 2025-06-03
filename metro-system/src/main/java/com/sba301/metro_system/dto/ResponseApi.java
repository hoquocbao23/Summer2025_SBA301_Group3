package com.sba301.metro_system.dto;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

public class ResponseApi<T>  {
    private int status;
    private String message;
    private T data;


}
