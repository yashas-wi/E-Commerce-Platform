import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartDrawer({ onProceedCheckout, onRequireAuth }) {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalAmount, totalCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      onRequireAuth();
    } else {
      setIsCartOpen(false);
      onProceedCheckout();
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      justifyContent: "flex-end",
      backgroundColor: "rgba(15, 23, 42, 0.5)",
      backdropFilter: "blur(4px)"
    }}>
      {/* Background click overlay */}
      <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)}></div>

      {/* Slide-out Drawer */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#ffffff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-xl)"
      }} className="animate-slide-in">
        {/* Drawer Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
              Shopping Cart ({totalCount})
            </h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Order Service Microservice</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              fontWeight: "700",
              fontSize: "14px"
            }}
          >
            ? Close
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>??</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#475569" }}>Your cart is empty</h3>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>Add items from the store to see them here.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "14px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #f1f5f9"
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "var(--radius-md)",
                      objectFit: "cover",
                      backgroundColor: "#f8fafc"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#4f46e5" }}>
                      ${Number(item.price).toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "#f1f5f9",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "13px", fontWeight: "700", minWidth: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "#f1f5f9",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          marginLeft: "auto",
                          fontSize: "12px",
                          color: "#ef4444",
                          backgroundColor: "transparent"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border)",
            backgroundColor: "#f8fafc"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>Subtotal</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Total</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#4f46e5" }}>${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "15px",
                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)"
              }}
            >
              {isAuthenticated ? "Proceed to Checkout ?" : "Sign In to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
