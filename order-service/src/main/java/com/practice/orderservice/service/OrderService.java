package com.practice.orderservice.service;

import com.practice.orderservice.client.InventoryClient;
import com.practice.orderservice.dto.CheckoutRequest;
import com.practice.orderservice.dto.OrderResponseDto;
import com.practice.orderservice.entity.Cart;
import com.practice.orderservice.entity.Order;
import com.practice.orderservice.entity.OrderItem;
import com.practice.orderservice.entity.OrderStatus;
import com.practice.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final InventoryClient inventoryClient;

    private OrderResponseDto toDto(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddressId(order.getShippingAddressId())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    @Transactional
    public OrderResponseDto checkout(CheckoutRequest request) {
        Cart cart = cartService.getOrCreateCart(request.getUserId());

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout an empty cart!");
        }


        Order order = Order.builder()
                .userId(request.getUserId())
                .shippingAddressId(request.getShippingAddressId())
                .totalAmount(cart.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();


        for (var cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(cartItem.getProductId())
                    .productName(cartItem.getProductName())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();
            order.addOrderItem(orderItem);
        }


        Order savedOrder = orderRepository.save(order);

        for (var cartItem : cart.getItems()) {
            try {
                inventoryClient.deductStock(Map.of(
                        "productId", cartItem.getProductId(),
                        "quantity", cartItem.getQuantity()
                ));
            } catch (Exception e) {
                System.err.println("Warning: Could not deduct inventory for product "
                        + cartItem.getProductId() + ": " + e.getMessage());
            }
        }

        cartService.clearCart(request.getUserId());

        return toDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return toDto(order);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return toDto(orderRepository.save(order));
    }
}
