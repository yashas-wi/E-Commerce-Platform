package com.practice.orderservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PutMapping("/api/inventory/deduct")
    Map<String, Object> deductStock(@RequestBody Map<String, Object> request);
}
