package com.practice.ecommerceplatform.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "User & Authentication Microservice",
                "status", "UP",
                "port", 8081,
                "endpoints", Map.of(
                        "register", "POST /api/users/register",
                        "login", "POST /api/users/login",
                        "profile", "GET /api/users/me"
                )
        ));
    }
}
