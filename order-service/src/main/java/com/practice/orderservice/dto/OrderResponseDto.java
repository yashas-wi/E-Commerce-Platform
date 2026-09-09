package com.practice.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
    private Long shippingAddressId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
