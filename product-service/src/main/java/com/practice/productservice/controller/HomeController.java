package com.practice.productservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "Product & Catalog Microservice",
                "status", "UP",
                "port", 8082,
                "endpoints", Map.of(
                        "allProducts", "GET /api/products",
                        "productById", "GET /api/products/{id}",
                        "allCategories", "GET /api/categories"
                )
        ));
    }
}
