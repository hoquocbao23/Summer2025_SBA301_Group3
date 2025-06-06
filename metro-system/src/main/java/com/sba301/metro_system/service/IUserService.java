package com.sba301.metro_system.service;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.entity.Account;

public interface IUserService {
    ResponseApi<?> login(LoginRequestDTO loginRequestDTO);
    ResponseApi<?> register(String mail);
    ResponseApi<?> verify(SignupRequestDTO signupRequestDTO, Integer otp);
}
