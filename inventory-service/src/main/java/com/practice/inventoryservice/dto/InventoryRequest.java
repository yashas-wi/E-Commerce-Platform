package com.practice.inventoryservice.dto;

import lombok.Data;

@Data
public class InventoryRequest {
    private Long productId;
    private String productName;
    private Integer quantity;
}
