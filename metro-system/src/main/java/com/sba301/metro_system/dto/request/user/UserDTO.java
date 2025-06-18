package com.sba301.metro_system.dto.request.user;

import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullname;
    private Role role;
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
}
