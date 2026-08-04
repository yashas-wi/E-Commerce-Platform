package com.practice.ecommerceplatform.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String email;
    private String role;
}
