package com.practice.paymentservice.service;

import com.practice.paymentservice.client.OrderClient;
import com.practice.paymentservice.dto.OrderResponse;
import com.practice.paymentservice.dto.PaymentRequest;
import com.practice.paymentservice.dto.PaymentResponse;
import com.practice.paymentservice.entity.Payment;
import com.practice.paymentservice.entity.PaymentStatus;
import com.practice.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import com.practice.paymentservice.client.NotificationClient;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    private final NotificationClient notificationClient;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {

        OrderResponse order;
        try {
            order = orderClient.getOrderById(request.getOrderId());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Could not find or reach Order with ID " + request.getOrderId() + ": " + e.getMessage());
        }

        if (order == null) {
            throw new RuntimeException("Order not found with ID: " + request.getOrderId());
        }


        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Payment cannot be processed. Order status is already: " + order.getStatus());
        }


        if (order.getTotalAmount().compareTo(request.getAmount()) != 0) {
            throw new RuntimeException("Payment amount (" + request.getAmount() + ") does not match order total (" + order.getTotalAmount() + ")!");
        }


        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 5. Create and Save Payment Record
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMode(request.getPaymentMode())
                .paymentStatus(PaymentStatus.SUCCESS)
                .transactionId(transactionId)
                .paymentGatewayReference("GATEWAY-REF-" + System.currentTimeMillis())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        try {
            orderClient.updateOrderStatus(request.getOrderId(), "PROCESSING");
        } catch (Exception e) {
            System.err.println("Warning: Failed to update order status: " + e.getMessage());
        }

        // 7. Dispatch Payment Notification via notification-service
        try {
            notificationClient.sendPaymentSuccessNotification(Map.of(
                    "toEmail", "customer" + request.getUserId() + "@example.com",
                    "orderId", savedPayment.getOrderId(),
                    "amount", savedPayment.getAmount(),
                    "paymentMode", savedPayment.getPaymentMode(),
                    "transactionId", savedPayment.getTransactionId(),
                    "userId", savedPayment.getUserId()
            ));
        } catch (Exception e) {
            System.err.println("Warning: Failed to dispatch payment notification: " + e.getMessage());
        }


        return PaymentResponse.builder()
                .paymentId(savedPayment.getId())
                .orderId(savedPayment.getOrderId())
                .userId(savedPayment.getUserId())
                .amount(savedPayment.getAmount())
                .paymentMode(savedPayment.getPaymentMode())
                .paymentStatus(savedPayment.getPaymentStatus())
                .transactionId(savedPayment.getTransactionId())
                .message("Payment processed successfully! Order is now PROCESSING.")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found for transaction: " + transactionId));

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .paymentMode(payment.getPaymentMode())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .message("Payment details retrieved successfully.")
                .timestamp(payment.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }
}
