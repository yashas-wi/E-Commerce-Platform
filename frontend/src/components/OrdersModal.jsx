import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function OrdersModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/orders/user/${user?.userId || 1}`);
      setOrders(res.data);
    } catch (e) {
      console.warn("Could not fetch user orders:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: "560px",
        width: "100%",
        padding: "28px",
        boxShadow: "var(--shadow-xl)",
        position: "relative",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column"
      }} className="animate-fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>My Orders</h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Order History for {user?.email}</span>
          </div>
          <button onClick={onClose} style={{ color: "#94a3b8", fontSize: "18px", fontWeight: "700" }}>?</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>??</div>
              <p>No orders found yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "800", color: "#0f172a" }}>Order #{ord.id}</span>
                    <span style={{
                      backgroundColor: ord.status === "PROCESSING" ? "#dcfce7" : "#fef3c7",
                      color: ord.status === "PROCESSING" ? "#16a34a" : "#b45309",
                      fontSize: "11px",
                      fontWeight: "800",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)"
                    }}>
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
                    <span>Total Amount:</span>
                    <strong style={{ color: "#0f172a" }}>${Number(ord.totalAmount).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
