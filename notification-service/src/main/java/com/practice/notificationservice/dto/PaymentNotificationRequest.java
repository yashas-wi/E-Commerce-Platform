package com.practice.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentNotificationRequest {
    private String toEmail;
    private Long orderId;
    private BigDecimal amount;
    private String paymentMode;
    private String transactionId;
    private Long userId;
}
