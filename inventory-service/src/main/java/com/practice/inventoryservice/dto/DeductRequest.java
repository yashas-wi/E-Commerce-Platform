package com.practice.inventoryservice.dto;

import lombok.Data;

@Data
public class DeductRequest {
    private Long productId;
    private Integer quantity;
}
