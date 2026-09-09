package com.practice.orderservice.service;

import com.practice.orderservice.client.ProductClient;
import com.practice.orderservice.dto.AddToCartRequest;
import com.practice.orderservice.dto.ProductResponse;
import com.practice.orderservice.entity.Cart;
import com.practice.orderservice.entity.CartItem;
import com.practice.orderservice.repository.CartItemRepository;
import com.practice.orderservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .userId(userId)
                                .totalPrice(BigDecimal.ZERO)
                                .build()
                ));
    }

    @Transactional
    public Cart addToCart(AddToCartRequest request) {
        // 1. Call Product Service via OpenFeign to verify product exists and get fresh price
        ProductResponse product = productClient.getProductById(request.getProductId());
        if (product == null) {
            throw new RuntimeException("Product not found with ID: " + request.getProductId());
        }

        // 2. Get or create Cart for user
        Cart cart = getOrCreateCart(request.getUserId());

        // 3. Check if product already in cart
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setPrice(product.getPrice());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(product.getId())
                    .productName(product.getName())
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.addItem(newItem);
        }

        // 4. Recalculate total price
        recalculateTotal(cart);

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cart.setTotalPrice(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalPrice(total);
    }
}
