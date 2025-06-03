package com.sba301.metro_system.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseApi<T>  {
    private int status;
    private String message;
    private T data;


}
