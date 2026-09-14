package com.practice.notificationservice.service;

import com.practice.notificationservice.dto.PaymentNotificationRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@ecommerce.com}")
    private String senderEmail;

    public boolean sendPaymentSuccessEmail(PaymentNotificationRequest request) {
        log.info("=================================================");
        log.info("?? PAYMENT SUCCESS NOTIFICATION");
        log.info("To: {}", request.getToEmail());
        log.info("Order ID: #{}", request.getOrderId());
        log.info("Transaction ID: {}", request.getTransactionId());
        log.info("Amount Paid: ${}", request.getAmount());
        log.info("Payment Mode: {}", request.getPaymentMode());
        log.info("=================================================");

        // If email not provided, skip sending real mail
        if (request.getToEmail() == null || request.getToEmail().isBlank()) {
            log.warn("Recipient email is missing; simulated notification only.");
            return true;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(senderEmail);
            helper.setTo(request.getToEmail());
            helper.setSubject("Payment Confirmation - Order #" + request.getOrderId());

            String htmlContent = String.format("""
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2e7d32;">?? Payment Successful!</h2>
                    <p>Thank you for your purchase. We have received your payment.</p>
                    <table style="border-collapse: collapse; width: 100%%; max-width: 500px;">
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px 0;"><strong>Order ID:</strong></td>
                            <td style="padding: 8px 0;">#%d</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
                            <td style="padding: 8px 0;">$%s</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 8px 0;"><strong>Payment Mode:</strong></td>
                            <td style="padding: 8px 0;">%s</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;">Your order is now being processed.</p>
                    <p style="color: #888; font-size: 12px;">E-Commerce Platform Team</p>
                </div>
            """, request.getOrderId(), request.getTransactionId(), request.getAmount(), request.getPaymentMode());

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent successfully to {}", request.getToEmail());
            return true;
        } catch (Exception e) {
            log.error("Failed to send email via SMTP (log notification succeeded): {}", e.getMessage());
            // We return true so that mail server configuration failure doesn't break the payment flow
            return true;
        }
    }
}
