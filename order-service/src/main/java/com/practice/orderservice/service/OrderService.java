package com.practice.orderservice.service;

import com.practice.orderservice.dto.CheckoutRequest;
import com.practice.orderservice.entity.Cart;
import com.practice.orderservice.entity.Order;
import com.practice.orderservice.entity.OrderItem;
import com.practice.orderservice.entity.OrderStatus;
import com.practice.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;

    @Transactional
    public Order checkout(CheckoutRequest request) {
        Cart cart = cartService.getOrCreateCart(request.getUserId());

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot checkout an empty cart!");
        }

        // 1. Build Order from Cart
        Order order = Order.builder()
                .userId(request.getUserId())
                .shippingAddressId(request.getShippingAddressId())
                .totalAmount(cart.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();

        // 2. Convert CartItems to OrderItems
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

        // 3. Save Order
        Order savedOrder = orderRepository.save(order);

        // 4. Clear Cart after successful checkout
        cartService.clearCart(request.getUserId());

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
