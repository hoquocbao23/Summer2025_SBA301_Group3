package com.sba301.metro_system.service.implement;

import com.sba301.metro_system.dto.ResponseApi;
import com.sba301.metro_system.dto.request.LoginRequestDTO;
import com.sba301.metro_system.dto.request.SignupRequestDTO;
import com.sba301.metro_system.dto.request.user.UserDTO;
import com.sba301.metro_system.dto.response.LoginResponse;
import com.sba301.metro_system.dto.response.TicketResponseDto;
import com.sba301.metro_system.entity.Account;
import com.sba301.metro_system.entity.OTP;
import com.sba301.metro_system.entity.Ticket;
import com.sba301.metro_system.entity.UserPrinciple;
import com.sba301.metro_system.enums.AccountStatus;
import com.sba301.metro_system.enums.Role;
import com.sba301.metro_system.record.MailBody;
import com.sba301.metro_system.repository.OtpRepository;
import com.sba301.metro_system.repository.TicketRepository;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    TicketRepository ticketRepository;

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
            if (user.getStatus() == AccountStatus.BANNED || user.getStatus() == AccountStatus.INACTIVE) {
                return ResponseApi.
                        builder().
                        status(HttpStatus.UNAUTHORIZED.value()).
                        message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                        data("Your account is banned or inactive.").
                        build();
            }
            String token = jwtService.generateToken(user.getEmail(), user.getAccountId());
            System.out.println(user.getRole());
            LoginResponse response = new LoginResponse(user.getAccountId(), token, user.getFullname(), user.getRole().name());
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
    public ResponseApi<?> verify(SignupRequestDTO signupRequestDTO, Integer otp) {
        OTP otp1 = otpService.findByOtpToken(otp);
        if (otp1 == null) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.NOT_FOUND.value()).
                    message(HttpStatus.NOT_FOUND.getReasonPhrase()).
                    data("Otp not found").
                    build();
        }
        if (otp1.isExpired()) {
            otpRepository.delete(otp1);
            return ResponseApi.
                    builder().
                    status(HttpStatus.UNAUTHORIZED.value()).
                    message(HttpStatus.UNAUTHORIZED.getReasonPhrase()).
                    data("Otp has expired").
                    build();
        }
        if (!otp1.getOtpToken().equals(otp)) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Otp does not match expected value.").
                    build();
        }
        if (otp1.getMail().equals(signupRequestDTO.getEmail())) {
            return ResponseApi.
                    builder().
                    status(HttpStatus.BAD_REQUEST.value()).
                    message(HttpStatus.BAD_REQUEST.getReasonPhrase()).
                    data("Otp does not match expected value.").
                    build();
        }
        Account user = userRepository.findByEmail(signupRequestDTO.getEmail());
        if (user != null) {
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

    @Override
    public ResponseApi<?> loginGoogle() {
        return null;
    }

    @Override
    public ResponseApi<?> getAllUser() {
        List<Account> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();

        for (Account u : users) {
            UserDTO dto = new UserDTO();
            dto.setEmail(u.getEmail());
            dto.setFullname(u.getFullname());
            dto.setStatus(u.getStatus());
            dto.setRole(u.getRole());
            dto.setId(u.getAccountId());
            userDTOs.add(dto);
        }

        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userDTOs)
                .build();
    }

    @Override
    public ResponseApi<?> updateUser(Long id, UserDTO user) {
        Optional<Account> accountOp = userRepository.findById(id);

        if (accountOp.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("User not found with id: " + id)
                    .data(null)
                    .build();
        }

        Account account = accountOp.get();
        account.setEmail(user.getEmail());
        account.setFullname(user.getFullname());
        account.setStatus(user.getStatus());
        account.setRole(user.getRole());
        Account updatedAccount = userRepository.save(account);

        UserDTO updatedDTO = new UserDTO();
        updatedDTO.setEmail(updatedAccount.getEmail());
        updatedDTO.setFullname(updatedAccount.getFullname());
        updatedDTO.setRole(updatedAccount.getRole());
        updatedDTO.setStatus(updatedAccount.getStatus());
        updatedDTO.setId(updatedAccount.getAccountId());
        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(updatedDTO)
                .build();
    }

    @Override
    public ResponseApi<?> getUserById(Long id) {
        Optional<Account> optionalAccount = userRepository.findById(id);

        if (optionalAccount.isEmpty()) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message("User not found with id: " + id)
                    .data(null)
                    .build();
        }

        Account account = optionalAccount.get();
        UserDTO userDTO = new UserDTO();
        userDTO.setFullname(account.getFullname());
        userDTO.setRole(account.getRole());
        userDTO.setStatus(account.getStatus());
        userDTO.setEmail(account.getEmail());
        userDTO.setId(account.getAccountId());

        return ResponseApi.builder()
                .status(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(userDTO)
                .build();
    }

    @Override
    public ResponseApi<?> getMyTicket() {
        UserPrinciple userPrinciple = (UserPrinciple) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrinciple == null || userPrinciple.getUser() == null) {
            throw new IllegalStateException("User not authenticated or user data is missing");
        }
        if (userPrinciple == null) {
            return ResponseApi.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .message(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                    .data("Have no permission to access this resource")
                    .build();
        }
        Account account = userPrinciple.getUser();
        List<Ticket> ticket = ticketRepository.findTicketByAccount(account);
        if (ticket == null) {
            return ResponseApi.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(HttpStatus.NOT_FOUND.getReasonPhrase())
                    .data("Have no ticket")
                    .build();
        }
        List<TicketResponseDto> ticketResponseDtoList = new ArrayList<>();

        for (Ticket t : ticket) {
            TicketResponseDto dto = new TicketResponseDto();

            dto.setTicketId(t.getTicketId());
            dto.setDepartureStation(
                    t.getDepartureStation() != null ? t.getDepartureStation().getStationLocation() : null
            );
            dto.setArrivalStation(
                    t.getArrivalStation() != null ? t.getArrivalStation().getStationName() : null
            );
            dto.setOldPrice(t.getOldPrice());
            dto.setNewPrice(t.getNewPrice());
            dto.setValidFrom(t.getValidFrom());
            dto.setValidTo(t.getValidTo());
            dto.setPurchaseTime(t.getPurchaseTime());
            dto.setQrUrl(t.getQrUrl());
            dto.setTicketStatus(t.getTicketStatus());

            if (t.getTicketType() != null) {
                dto.setTicketName(t.getTicketType().getTicketName());
            }

            if (t.getPromotion() != null) {
                dto.setPromotionCode(t.getPromotion().getPromotionCode());
            }

            if (t.getRoute() != null) {
                dto.setRouteName(t.getRoute().getRouteName());
            }

            dto.setUrlCheckout("https://localhost:5173/checkout/" + t.getTicketId());

            ticketResponseDtoList.add(dto);
        }

        return ResponseApi.builder()
                    .status(HttpStatus.OK.value())
                    .message(HttpStatus.OK.getReasonPhrase())
                    .data(ticketResponseDtoList)
                    .build();


    }
}