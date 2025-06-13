package com.sba301.metro_system.utils;

import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.UserPrinciple;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AccountHelper {
    public static UserPrinciple getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrinciple) authentication.getPrincipal();
    }
}
