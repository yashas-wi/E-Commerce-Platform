package com.practice.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/payment-success")
    Map<String, Object> sendPaymentSuccessNotification(@RequestBody Map<String, Object> notificationRequest);
}
