package com.practice.inventoryservice.controller;

import com.practice.inventoryservice.dto.DeductRequest;
import com.practice.inventoryservice.dto.InventoryRequest;
import com.practice.inventoryservice.dto.InventoryResponse;
import com.practice.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse> getInventory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getByProductId(productId));
    }

    @PostMapping("/add")
    public ResponseEntity<InventoryResponse> addStock(@RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.addStock(request));
    }

    @PutMapping("/deduct")
    public ResponseEntity<InventoryResponse> deductStock(@RequestBody DeductRequest request) {
        return ResponseEntity.ok(inventoryService.deductStock(request));
    }
}
