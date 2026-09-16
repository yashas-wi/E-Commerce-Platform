import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const parts = fullName.trim().split(" ");
        const firstName = parts[0] || "Customer";
        const lastName = parts.slice(1).join(" ") || "User";
        await register({
          email,
          password,
          fullName,
          firstName,
          lastName,
          phoneNumber: "9876543210"
        });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Authentication failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
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
      zIndex: 50,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius-lg)",
        maxWidth: "440px",
        width: "100%",
        padding: "32px",
        boxShadow: "var(--shadow-xl)",
        position: "relative"
      }} className="animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#94a3b8",
            fontSize: "20px",
            fontWeight: "700",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)"
          }}
        >
          ?
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
            {isRegister ? "Create Customer Account" : "Welcome Back"}
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            {isRegister
              ? "Register to place orders and manage your cart"
              : "Sign in with your email and password"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          backgroundColor: "#f1f5f9",
          borderRadius: "var(--radius-md)",
          padding: "4px",
          marginBottom: "20px"
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 0",
              fontSize: "13px",
              fontWeight: "700",
              borderRadius: "var(--radius-sm)",
              backgroundColor: !isRegister ? "#ffffff" : "transparent",
              color: !isRegister ? "#0f172a" : "#64748b",
              boxShadow: !isRegister ? "var(--shadow-sm)" : "none"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 0",
              fontSize: "13px",
              fontWeight: "700",
              borderRadius: "var(--radius-sm)",
              backgroundColor: isRegister ? "#ffffff" : "transparent",
              color: isRegister ? "#0f172a" : "#64748b",
              boxShadow: isRegister ? "var(--shadow-sm)" : "none"
            }}
          >
            Register
          </button>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)"
            }}
          >
            {loading ? "Processing..." : (isRegister ? "Create Account & Sign In" : "Sign In to CloudCart")}
          </button>
        </form>
      </div>
    </div>
  );
}
