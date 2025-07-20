package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.ForgotPasswordRequestDTO;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.ResetPasswordRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.dto.response.LoginResponse;
import com.sba301.metro_system.dto.response.UserResponseDto;
import com.sba301.metro_system.exception.NotFoundException;
import com.sba301.metro_system.service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/security")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class SecurityController {

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            LoginResponse loginResponse = userService.login(loginRequestDTO);
            ResponseApi<LoginResponse> response = ResponseApi.<LoginResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("Login successful")
                    .data(loginResponse)
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody String mail) {
        try {
            String message = userService.register(mail);
            ResponseApi<String> response = ResponseApi.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Registration successful")
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

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody SignupRequestDTO signupRequestDTO, @RequestParam Integer otp) {
        try {
            UserResponseDto userResponse = userService.verify(signupRequestDTO, otp);
            ResponseApi<UserResponseDto> response = ResponseApi.<UserResponseDto>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Account verification successful")
                    .data(userResponse)
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        try {
            String message = userService.forgotPassword(forgotPasswordRequestDTO.getEmail());
            ResponseApi<String> response = ResponseApi.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("OTP sent successfully")
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

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        try {
            String message = userService.resetPassword(resetPasswordRequestDTO.getToken(),
                    resetPasswordRequestDTO.getNewPassword());
            ResponseApi<String> response = ResponseApi.<String>builder()
                    .status(HttpStatus.OK.value())
                    .message("Password reset successfully")
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
