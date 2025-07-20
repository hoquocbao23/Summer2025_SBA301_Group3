package com.sba301.metro_system.mapper;

import com.sba301.metro_system.dto.response.UserResponseDto;
import com.sba301.metro_system.entity.Account;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponseDto toResponseDto(Account account) {
        if (account == null) {
            return null;
        }

        return UserResponseDto.builder()
                .accountId(account.getAccountId())
                .email(account.getEmail())
                .fullname(account.getFullname())
                .role(account.getRole())
                .status(account.getStatus())
                .build();
    }

    public List<UserResponseDto> toResponseDtoList(List<Account> accounts) {
        if (accounts == null) {
            return null;
        }

        return accounts.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }
}
