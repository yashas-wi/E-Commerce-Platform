package com.practice.paymentservice.client;

import com.practice.paymentservice.dto.OrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service")
public interface OrderClient {

    @GetMapping("/api/orders/{orderId}")
    OrderResponse getOrderById(@PathVariable("orderId") Long orderId);

    @PutMapping("/api/orders/{orderId}/status")
    OrderResponse updateOrderStatus(@PathVariable("orderId") Long orderId, @RequestParam("status") String status);
}
