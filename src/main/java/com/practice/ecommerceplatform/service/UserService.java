package com.practice.ecommerceplatform.service;

import com.practice.ecommerceplatform.dto.AuthResponse;
import com.practice.ecommerceplatform.dto.LoginRequest;
import com.practice.ecommerceplatform.dto.RegisterRequest;
import com.practice.ecommerceplatform.entity.Role;
import com.practice.ecommerceplatform.entity.User;
import com.practice.ecommerceplatform.repository.UserRepository;
import com.practice.ecommerceplatform.security.JwtUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

//import static jdk.internal.org.jline.reader.impl.LineReaderImpl.CompletionType.List;

@Service
@RequiredArgsConstructor
@Builder
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;


    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password cannot be empty!");
        }

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
                .IsEnabled(true)
                .build();
        userRepository.save(user);


        // 5. Generate real JWT Token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : "ROLE_CUSTOMER")
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse loginUser(LoginRequest request) {

        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        // 2. Verify password with BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        // 3. Check if user is enabled
        if (!user.getIsEnabled()) {
            throw new RuntimeException("User account is disabled!");
        }

        // 4. Generate real JWT Token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }


//    public User getUserByEmail(String currentEmail) {
//        return userRepository.findByEmail(currentEmail)
//                .orElseThrow(() -> new RuntimeException("Invalid email!"));
//    }


    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with email: " + email));

        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetToken(code);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        System.out.println("=================================================");
        System.out.println("🔐 PASSWORD RESET CODE FOR " + email + ": " + code);
        System.out.println("Valid for 15 minutes");
        System.out.println("=================================================");

        return code;
    }

    @Transactional
    public boolean resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with email: " + email));

        if (user.getResetToken() == null || !user.getResetToken().equals(code)) {
            throw new RuntimeException("Invalid password reset code!");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Password reset code has expired! Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return true;
    }
}

