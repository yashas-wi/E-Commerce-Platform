package com.practice.paymentservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "Payment Processing Microservice",
                "status", "UP",
                "port", 8084,
                "endpoints", Map.of(
                        "processPayment", "POST /api/payments/process",
                        "paymentByTransaction", "GET /api/payments/transaction/{transactionId}",
                        "paymentsByUserId", "GET /api/payments/user/{userId}"
                )
        ));
    }
}
