package com.sba301.metro_system.dto.request.admin;

import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO for admin to update user information")
public class AdminUserUpdateDTO {

    @Schema(description = "User's email address", example = "user@example.com")
    @Email(message = "Email should be valid")
    private String email;

    @Schema(description = "User's full name", example = "John Doe")
    private String fullname;

    @Schema(description = "User's role in the system", example = "CUSTOMER")
    private Role role;

    @Schema(description = "User's account status", example = "ACTIVE")
    private AccountStatus status;

    @Schema(description = "Reason for status/role change (optional)", example = "Account upgrade requested")
    private String changeReason;
}
