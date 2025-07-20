package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.user.UserDTO;
import com.sba301.metro_system.dto.response.UserResponseDto;
import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import com.sba301.metro_system.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Management", description = "APIs for admin to manage users")
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

    @Autowired
    private IUserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users in the system (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<List<UserResponseDto>>> getAllUsers() {
        try {
            List<UserResponseDto> users = userService.getAllUser();
            return ResponseEntity.ok(
                    ResponseApi.<List<UserResponseDto>>builder()
                            .status(HttpStatus.OK.value())
                            .message("Users retrieved successfully")
                            .data(users)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseApi.<List<UserResponseDto>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Error retrieving users: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by their ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<UserResponseDto>> getUserById(
            @Parameter(description = "User ID", required = true) @PathVariable Long id) {
        try {
            UserResponseDto user = userService.getUserById(id);
            return ResponseEntity.ok(
                    ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.OK.value())
                            .message("User retrieved successfully")
                            .data(user)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.NOT_FOUND.value())
                            .message("User not found: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update user information (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<UserResponseDto>> updateUser(
            @Parameter(description = "User ID", required = true) @PathVariable Long id,
            @Parameter(description = "User data to update", required = true) @RequestBody UserDTO userDTO) {
        try {
            UserResponseDto updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(
                    ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.OK.value())
                            .message("User updated successfully")
                            .data(updatedUser)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Error updating user: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update user status", description = "Update user account status (ACTIVE, INACTIVE, BANNED) - Admin only")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User status updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<UserResponseDto>> updateUserStatus(
            @Parameter(description = "User ID", required = true) @PathVariable Long id,
            @Parameter(description = "New account status", required = true) @RequestParam AccountStatus status) {
        try {
            // Create a UserDTO with only status change
            UserDTO userDTO = new UserDTO();
            userDTO.setStatus(status);

            UserResponseDto updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(
                    ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.OK.value())
                            .message("User status updated successfully to " + status)
                            .data(updatedUser)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Error updating user status: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Update user role", description = "Update user role (ADMIN, CUSTOMER) - Admin only")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User role updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid role")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<UserResponseDto>> updateUserRole(
            @Parameter(description = "User ID", required = true) @PathVariable Long id,
            @Parameter(description = "New role", required = true) @RequestParam Role role) {
        try {
            // Create a UserDTO with only role change
            UserDTO userDTO = new UserDTO();
            userDTO.setRole(role);

            UserResponseDto updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(
                    ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.OK.value())
                            .message("User role updated successfully to " + role)
                            .data(updatedUser)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseApi.<UserResponseDto>builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .message("Error updating user role: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search users by email or name (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<List<UserResponseDto>>> searchUsers(
            @Parameter(description = "Search keyword for email or name") @RequestParam(required = false) String keyword,
            @Parameter(description = "Filter by role") @RequestParam(required = false) Role role,
            @Parameter(description = "Filter by status") @RequestParam(required = false) AccountStatus status) {
        try {
            List<UserResponseDto> users = userService.getAllUser();

            // Filter users based on search criteria
            List<UserResponseDto> filteredUsers = users.stream()
                    .filter(user -> keyword == null || keyword.isEmpty() ||
                            (user.getEmail() != null && user.getEmail().toLowerCase().contains(keyword.toLowerCase()))
                            ||
                            (user.getFullname() != null
                                    && user.getFullname().toLowerCase().contains(keyword.toLowerCase())))
                    .filter(user -> role == null || user.getRole() == role)
                    .filter(user -> status == null || user.getStatus() == status)
                    .toList();

            return ResponseEntity.ok(
                    ResponseApi.<List<UserResponseDto>>builder()
                            .status(HttpStatus.OK.value())
                            .message("Search completed successfully. Found " + filteredUsers.size() + " users.")
                            .data(filteredUsers)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseApi.<List<UserResponseDto>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Error searching users: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Get user statistics", description = "Get user statistics including counts by role and status (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Admin access required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseApi<UserStats>> getUserStats() {
        try {
            List<UserResponseDto> users = userService.getAllUser();

            UserStats stats = UserStats.builder()
                    .totalUsers(users.size())
                    .adminCount(users.stream().mapToInt(u -> u.getRole() == Role.ADMIN ? 1 : 0).sum())
                    .customerCount(users.stream().mapToInt(u -> u.getRole() == Role.CUSTOMER ? 1 : 0).sum())
                    .activeCount(users.stream().mapToInt(u -> u.getStatus() == AccountStatus.ACTIVE ? 1 : 0).sum())
                    .inactiveCount(users.stream().mapToInt(u -> u.getStatus() == AccountStatus.INACTIVE ? 1 : 0).sum())
                    .bannedCount(users.stream().mapToInt(u -> u.getStatus() == AccountStatus.BANNED ? 1 : 0).sum())
                    .build();

            return ResponseEntity.ok(
                    ResponseApi.<UserStats>builder()
                            .status(HttpStatus.OK.value())
                            .message("User statistics retrieved successfully")
                            .data(stats)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseApi.<UserStats>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Error retrieving user statistics: " + e.getMessage())
                            .build());
        }
    }

    // Inner class for user statistics
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserStats {
        private int totalUsers;
        private int adminCount;
        private int customerCount;
        private int activeCount;
        private int inactiveCount;
        private int bannedCount;
    }
}
