package com.sba301.metro_system.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

public interface IJwtService {
    String generateToken(String username, Long userId);
    String extractUserName(String token);
    Integer getUserIdFromToken(String token);
    boolean validateToken(String token, UserDetails userDetails);
    Date extractExpiration(String token);
}
