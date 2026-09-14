package com.practice.notificationservice.controller;

import com.practice.notificationservice.dto.PaymentNotificationRequest;
import com.practice.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/payment-success")
    public ResponseEntity<Map<String, Object>> sendPaymentSuccessNotification(@RequestBody PaymentNotificationRequest request) {
        boolean sent = emailService.sendPaymentSuccessEmail(request);
        return ResponseEntity.ok(Map.of(
                "success", sent,
                "message", "Payment notification dispatched successfully",
                "orderId", request.getOrderId(),
                "transactionId", request.getTransactionId()
        ));
    }
}
