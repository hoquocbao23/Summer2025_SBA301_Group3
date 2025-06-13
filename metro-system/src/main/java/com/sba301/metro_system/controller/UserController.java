package com.sba301.metro_system.controller;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.user.UserDTO;
import com.sba301.metro_system.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private IUserService userService;

    @GetMapping()
    public ResponseApi<?> getAllUser(){
        return userService.getAllUser();
    }

    @PutMapping("/{id}")
    public ResponseApi<?> updateUser(@PathVariable Long id, @RequestBody UserDTO user){
        return userService.updateUser(id,user);
    }

    @GetMapping("/{id}")
    public ResponseApi<?> getUser(@PathVariable Long id){
        return userService.getUserById(id);
    }

}
