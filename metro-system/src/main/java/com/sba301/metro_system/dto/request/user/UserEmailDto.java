package com.sba301.metro_system.dto.request.user;

import lombok.Data;

import java.util.HashSet;

@Data
public class UserEmailDto {
    HashSet<String> userMails;
}
