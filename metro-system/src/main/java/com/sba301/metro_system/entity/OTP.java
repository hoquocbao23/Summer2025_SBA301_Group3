package com.sba301.metro_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "otp")
@Data
@NoArgsConstructor
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otpID;
    private Integer otpToken;
    private String mail;
    private LocalDateTime createdAT;

    public boolean isExpired() {
        LocalDateTime expirationTime = createdAT.plusMinutes(5);
        return LocalDateTime.now().isAfter(expirationTime);
    }

    public OTP(Integer otpToken, String mail, LocalDateTime createdAT) {
        this.otpToken = otpToken;
        this.mail = mail;
        this.createdAT = createdAT;
    }
}
