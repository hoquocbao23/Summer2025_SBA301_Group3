package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.dto.response.LoginResponse;
import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.OTP;
import com.sba301.metro_system.entity.UserPrinciple;
import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import com.sba301.metro_system.record.MailBody;
import com.sba301.metro_system.repository.OtpRepository;
import com.sba301.metro_system.repository.UserRepository;
import com.sba301.metro_system.service.IEmailService;
import com.sba301.metro_system.service.IJwtService;
import com.sba301.metro_system.service.IOtpService;
import com.sba301.metro_system.service.IUserService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    @Autowired
    private IJwtService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    IOtpService otpService;

    @Autowired
    IEmailService emailService;

    @Autowired
    private OtpRepository otpRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public ResponseApi<?> login(LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword())
            );

            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
            Account user = userPrinciple.getUser();
            if(user.getStatus() == AccountStatus.BANNED || user.getStatus() == AccountStatus.INACTIVE){
                return ResponseApi.
                        builder().
                        status(HttpStatus.UNAUTHORIZED.value()).
                        message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                        data("Your account is banned or inactive.").
                        build();
            }
            String token = jwtService.generateToken(user.getEmail(), user.getAccountId());
            System.out.println(user.getRole());
            LoginResponse response = new LoginResponse(token,user.getFullname(),user.getRole().name());
             ResponseEntity.ok(response);
            return ResponseApi.
                    builder().
                    status(HttpStatus.OK.value()).
                    message(HttpStatus.OK.getReasonPhrase()).
                    data(response).
                    build();
        } catch (BadCredentialsException e) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("Incorrect username or password. Please try again.").
                    build();
        } catch (ExpiredJwtException e) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("Your session has expired. Please log in again.").
                    build();
        } catch (AuthenticationException e) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("Login failed. Please check your credentials and try again.").
                    build();
        } catch (Exception e) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.INTERNAL_SERVER_ERROR.value()).
                    message(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()).
                    data("An unexpected error occurred. Please try again later.").
                    build();
        }
    }


    @Override
    public ResponseApi<?> register(String email) {
        if (email == null) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Mail can not be null").
                    build();
        }
        Account users = userRepository.findByEmail(email);
        if (users != null) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Conflict mail").
                    build();
        }
        Integer otp = otpService.generateOTP();
        otpService.save(email, otp);
        String text = "Welcome to Metro SG! Your OTP is: <strong>" + otp + "</strong>. It is valid for 5 minutes.";
        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("Your Metro SG OTP")
                .text(text)
                .build();
        emailService.sendOTP(mailBody);
        return ResponseApi.
                builder().
                status(HttpStatus.OK.value()).
                message(HttpStatus.OK.getReasonPhrase()).
                data("Send mail successfully").
                build();
    }

    @Override
    public ResponseApi<?> verify(SignupRequestDTO signupRequestDTO,Integer otp) {
        OTP otp1 = otpService.findByOtpToken(otp);
        if(otp1 == null){
            return ResponseApi.
                    builder().
                    status(HttpStatus.NOT_FOUND.value()).
                    message(HttpStatus.NOT_FOUND.getReasonPhrase()).
                    data("Otp not found").
                    build();
        }
        if(otp1.isExpired()){
            otpRepository.delete(otp1);
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("Otp has expired").
                    build();
        }
        if(!otp1.getOtpToken().equals(otp)){
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Otp does not match expected value.").
                    build();
        }
        if(otp1.getMail().equals(signupRequestDTO.getEmail())){
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Otp does not match expected value.").
                    build();
        }
        Account user = userRepository.findByEmail(signupRequestDTO.getEmail());
        if(user !=null) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.CONFLICT.value()).
                    message(HttpStatus.CONFLICT.getReasonPhrase()).
                    data("Email already in use").
                    build();
        }
        Account user2 = new Account();
        user2.setRole(Role.CUSTOMER);
        user2.setEmail(signupRequestDTO.getEmail());
        user2.setPassword(encoder.encode(signupRequestDTO.getPassword()));
        user2.setFullname(signupRequestDTO.getFullName());
        user2.setStatus(AccountStatus.ACTIVE);
        userRepository.save(user2);
        otpRepository.delete(otpRepository.findByOtpToken(otp));
        return ResponseApi.
                builder().
                status(HttpStatus.OK.value()).
                message(HttpStatus.OK.getReasonPhrase()).
                data(user2).
                build();
    }





}
