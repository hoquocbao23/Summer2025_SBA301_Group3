package com.sba301.metro_system.dto.request;

import lombok.Data;

@Data
public class SignupRequestDTO {
    private String email;
    private String password;
    private String fullName;
}
