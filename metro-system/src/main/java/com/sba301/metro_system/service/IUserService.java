package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.request.ChangePasswordRequestDTO;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.dto.request.UpdateAccountRequestDTO;
import com.sba301.metro_system.dto.request.user.UserDTO;
import com.sba301.metro_system.dto.response.BookingResponseDto;
import com.sba301.metro_system.dto.response.LoginResponse;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.dto.response.UserBookingResponseDto;
import com.sba301.metro_system.dto.response.UserResponseDto;
import com.sba301.metro_system.entity.Booking;

import java.util.List;

public interface IUserService {
    LoginResponse login(LoginRequestDTO loginRequestDTO);

    String register(String mail);

    UserResponseDto verify(SignupRequestDTO signupRequestDTO, Integer otp);

    LoginResponse loginGoogle();

    List<UserResponseDto> getAllUser();

    UserResponseDto updateUser(Long id, UserDTO user);

    UserResponseDto getUserById(Long id);

    List<UserBookingResponseDto> getMyBooking(Long id);

    UserResponseDto updateMyAccount(Long userId, UpdateAccountRequestDTO updateAccountRequestDTO);

    String changePassword(Long userId, ChangePasswordRequestDTO changePasswordRequestDTO);

    String forgotPassword(String email);

    String resetPassword(String token, String newPassword);
}
