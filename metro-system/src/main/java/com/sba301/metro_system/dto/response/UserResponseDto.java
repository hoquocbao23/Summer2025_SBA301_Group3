package com.sba301.metro_system.dto.response;

import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long accountId;
    private String email;
    private String fullname;
    private Role role;
    private AccountStatus status;
}
