package com.practice.orderservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "Order & Cart Microservice",
                "status", "UP",
                "port", 8083,
                "endpoints", Map.of(
                        "getCart", "GET /api/cart/user/{userId}",
                        "addToCart", "POST /api/cart/add",
                        "checkout", "POST /api/orders/checkout",
                        "userOrders", "GET /api/orders/user/{userId}"
                )
        ));
    }
}
