package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.ChangePasswordRequestDTO;
import com.sba301.metro_system.dto.request.UpdateAccountRequestDTO;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.dto.response.UserBookingResponseDto;
import com.sba301.metro_system.dto.response.UserResponseDto;
import com.sba301.metro_system.entity.Booking;
import com.sba301.metro_system.entity.UserPrinciple;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private IUserService userService;

    @GetMapping()
    public ResponseEntity<?> getMyAccount() {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            Long currentUserId = userPrinciple.getUser().getAccountId();

            UserResponseDto user = userService.getUserById(currentUserId);
            ResponseApi<UserResponseDto> response = ResponseApi.<UserResponseDto>builder()
                    .status(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data(user)
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/ticket")
    public ResponseEntity<?> getMyTicket() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            Long currentUserId = userPrinciple.getUser().getAccountId();

            List<UserBookingResponseDto> bookings = userService.getMyBooking(currentUserId);
            ResponseApi<List<UserBookingResponseDto>> response = ResponseApi.<List<UserBookingResponseDto>>builder()
                    .status(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data(bookings)
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateMyAccount(@RequestBody UpdateAccountRequestDTO updateAccountRequestDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            Long currentUserId = userPrinciple.getUser().getAccountId();

            UserResponseDto updatedUser = userService.updateMyAccount(currentUserId, updateAccountRequestDTO);
            ResponseApi<UserResponseDto> response = ResponseApi.<UserResponseDto>builder()
                    .status(HttpStatus.OK.value())
                    .message("Account updated successfully")
                    .data(updatedUser)
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            Long currentUserId = userPrinciple.getUser().getAccountId();

            String message = userService.changePassword(currentUserId, changePasswordRequestDTO);
            ResponseApi<String> response = ResponseApi.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Password changed successfully")
                    .data(message)
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
