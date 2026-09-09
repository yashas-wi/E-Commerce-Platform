package com.practice.paymentservice.dto;

import com.practice.paymentservice.entity.PaymentMode;
import com.practice.paymentservice.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {

    private Long paymentId;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private PaymentMode paymentMode;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private String message;
    private LocalDateTime timestamp;
}
