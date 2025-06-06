package com.sba301.metro_system.service;

import com.sba301.metro_system.entity.OTP;

public interface IOtpService {
    Integer generateOTP();

    void save(String email, Integer otp);

    OTP findByOtpToken(Integer otp);
}
