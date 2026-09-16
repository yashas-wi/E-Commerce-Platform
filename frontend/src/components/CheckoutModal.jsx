import React, { useState } from "react";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState("CONFIRM"); // CONFIRM -> PAYING -> SUCCESS
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  if (!isOpen) return null;

  const handleCheckoutAndPay = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Create Order via Order Service (Auto-deducts inventory)
      const checkoutRes = await api.post("/api/orders/checkout", {
        userId: user?.userId || 1,
      });

      const orderData = checkoutRes.data;
      setCreatedOrder(orderData);

      // 2. Process Payment via Payment Service (triggers notification service)
      const payRes = await api.post("/api/payments/process", {
        orderId: orderData.id,
        userId: user?.userId || 1,
        amount: orderData.totalAmount || totalAmount,
        paymentMode: paymentMode,
      });

      setPaymentReceipt(payRes.data);
      clearCart();
      setStep("SUCCESS");
    } catch (err) {
      console.error("Payment flow failed:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Payment processing failed. Please ensure all backend microservices are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setStep("CONFIRM");
    setCreatedOrder(null);
    setPaymentReceipt(null);
    setError("");
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius-lg)",
        maxWidth: "520px",
        width: "100%",
        padding: "32px",
        boxShadow: "var(--shadow-xl)",
        position: "relative"
      }} className="animate-fade-in">
        {step === "CONFIRM" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Checkout & Pay</h2>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Order & Payment Services</span>
              </div>
              <button onClick={onClose} style={{ color: "#94a3b8", fontSize: "18px", fontWeight: "700" }}>?</button>
            </div>

            {error && (
              <div style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                fontSize: "13px",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            {/* Order Items Summary */}
            <div style={{
              backgroundColor: "#f8fafc",
              borderRadius: "var(--radius-md)",
              padding: "14px",
              marginBottom: "16px",
              maxHeight: "140px",
              overflowY: "auto"
            }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* Total Amount Banner */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
              backgroundColor: "#eef2ff",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px"
            }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#3730a3" }}>Total Due</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}>${totalAmount.toFixed(2)}</span>
            </div>

            {/* Select Payment Mode */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "10px" }}>
                Select Payment Mode
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMode === mode ? "2px solid #4f46e5" : "1px solid var(--border)",
                      backgroundColor: paymentMode === mode ? "#f5f3ff" : "#ffffff",
                      color: paymentMode === mode ? "#4f46e5" : "#475569",
                      fontWeight: "700",
                      fontSize: "13px"
                    }}
                  >
                    {mode === "UPI" && "? UPI / GooglePay"}
                    {mode === "CREDIT_CARD" && "?? Credit Card"}
                    {mode === "DEBIT_CARD" && "?? Debit Card"}
                    {mode === "NET_BANKING" && "?? Net Banking"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckoutAndPay}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)"
              }}
            >
              {loading ? "Processing Order & Payment..." : `Pay $${totalAmount.toFixed(2)} Now`}
            </button>
          </>
        )}

        {step === "SUCCESS" && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              fontSize: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              ?
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>
              Payment Successful!
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              Your order has been verified and transitioned to <strong>PROCESSING</strong>.
            </p>

            <div style={{
              backgroundColor: "#f8fafc",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              padding: "16px",
              textAlign: "left",
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Order ID:</span>
                <strong>#{createdOrder?.id || paymentReceipt?.orderId}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Transaction ID:</span>
                <code style={{ color: "#4f46e5", fontWeight: "700" }}>{paymentReceipt?.transactionId}</code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Amount Paid:</span>
                <strong>${Number(paymentReceipt?.amount || totalAmount).toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Payment Mode:</span>
                <strong>{paymentReceipt?.paymentMode || paymentMode}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Stock Deduction:</span>
                <span style={{ color: "#10b981", fontWeight: "700" }}>Inventory Updated ?</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Email Notification:</span>
                <span style={{ color: "#10b981", fontWeight: "700" }}>Dispatched ?</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px"
              }}
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
