package com.practice.ecommerceplatform.service;

import com.practice.ecommerceplatform.dto.AuthResponse;
import com.practice.ecommerceplatform.dto.RegisterRequest;
import com.practice.ecommerceplatform.entity.Role;
import com.practice.ecommerceplatform.entity.User;
import com.practice.ecommerceplatform.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Builder
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address is already in use!");
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.ROLE_CUSTOMER)
                .isEnabled(true)
                .build();
        userRepository.save(user);


        // JWT Generation will go here in Security phase
        String token = "DUMMY_JWT_TOKEN_FOR_" + user.getEmail();
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}

