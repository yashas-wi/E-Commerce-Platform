package com.practice.inventoryservice.service;

import com.practice.inventoryservice.dto.DeductRequest;
import com.practice.inventoryservice.dto.InventoryRequest;
import com.practice.inventoryservice.dto.InventoryResponse;
import com.practice.inventoryservice.entity.Inventory;
import com.practice.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private InventoryResponse toDto(Inventory inv) {
        return InventoryResponse.builder()
                .productId(inv.getProductId())
                .productName(inv.getProductName())
                .quantity(inv.getQuantity())
                .inStock(inv.getQuantity() > 0)
                .build();
    }

    @Transactional
    public InventoryResponse addStock(InventoryRequest request) {
        Inventory inv = inventoryRepository.findByProductId(request.getProductId())
                .orElse(Inventory.builder()
                        .productId(request.getProductId())
                        .productName(request.getProductName())
                        .quantity(0)
                        .build());
        inv.setQuantity(inv.getQuantity() + request.getQuantity());
        if (request.getProductName() != null) {
            inv.setProductName(request.getProductName());
        }
        return toDto(inventoryRepository.save(inv));
    }

    @Transactional
    public InventoryResponse deductStock(DeductRequest request) {
        Inventory inv = inventoryRepository.findByProductId(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found in inventory: " + request.getProductId()));

        if (inv.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product " + request.getProductId()
                    + ". Available: " + inv.getQuantity() + ", Requested: " + request.getQuantity());
        }

        inv.setQuantity(inv.getQuantity() - request.getQuantity());
        return toDto(inventoryRepository.save(inv));
    }

    @Transactional(readOnly = true)
    public InventoryResponse getByProductId(Long productId) {
        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found in inventory: " + productId));
        return toDto(inv);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
