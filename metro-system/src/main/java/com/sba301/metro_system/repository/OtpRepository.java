package com.sba301.metro_system.repository;

import com.sba301.metro_system.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepository extends JpaRepository<OTP,Long> {
    public OTP findByMail(String mail);
    public OTP findByOtpToken(Integer otp);
}
