package com.practice.apigateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private final SecretKey key = Keys.hmacShaKeyFor(
            "ecommerce_super_secret_key_12345_abcdef".getBytes(StandardCharsets.UTF_8)
    );

    public boolean validateToken(String token) {
        try {
            if (token == null) return false;
            token = token.trim();
            if (token.startsWith("\"") && token.endsWith("\"")) {
                token = token.substring(1, token.length() - 1);
            }
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            System.err.println("JWT Validation Error: " + e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        if (token == null) return null;
        token = token.trim();
        if (token.startsWith("\"") && token.endsWith("\"")) {
            token = token.substring(1, token.length() - 1);
        }
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        Object role = getClaims(token).get("role");
        return role != null ? role.toString() : "";
    }
}
