package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/security")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class SecurityController {

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public ResponseApi<?> login(@RequestBody LoginRequestDTO loginRequestDTO){
        return userService.login(loginRequestDTO);
    }

    @PostMapping("/register")
    public ResponseApi<?> register(@RequestBody String mail){
        return userService.register(mail);
    }

    @PostMapping("/verify")
    public ResponseApi<?> verify(@RequestBody SignupRequestDTO signupRequestDTO, @RequestParam Integer otp){
        return userService.verify(signupRequestDTO,otp);
    }

}
