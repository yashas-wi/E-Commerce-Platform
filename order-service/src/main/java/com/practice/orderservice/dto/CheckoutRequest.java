package com.practice.orderservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long shippingAddressId;
}
