package com.practice.paymentservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderResponse {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
    private Long shippingAddressId;
}
