package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.entity.OTP;
import com.sba301.metro_system.repository.OtpRepository;
import com.sba301.metro_system.service.IOtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OtpService implements IOtpService {

    @Autowired
    private OtpRepository otpRepo;

    @Override
    public Integer generateOTP() {
        return (int) (Math.random() * 900000) + 100000;
    }

    @Override
    public void save(String email, Integer otpToken) {
        OTP otp= otpRepo.findByMail(email);
        if(otp!=null){
            otpRepo.delete(otp);
        }
        OTP newOtp = new OTP();
        newOtp.setOtpToken(otpToken);
        newOtp.setMail(email);
        newOtp.setCreatedAT(LocalDateTime.now());
        otpRepo.save(newOtp);
    }

    @Override
    public OTP findByOtpToken(Integer otp) {
        return otpRepo.findByOtpToken(otp);
    }
}
