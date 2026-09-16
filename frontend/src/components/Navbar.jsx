import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ onOpenAuth, onOpenOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      backgroundColor: "#ffffff",
      borderBottom: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)"
    }}>
      {/* Top microservices indicator banner */}
      <div style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        fontSize: "12px",
        padding: "6px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#10b981",
            boxShadow: "0 0 6px #10b981"
          }}></span>
          <span>API Gateway connected: <strong>localhost:8080</strong> (Eureka Service Mesh Active)</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Auth • Products • Orders • Payments • Inventory • Notifications</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px"
      }}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => setSelectedCategory("ALL")}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "20px"
          }}>
            C
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: "#0f172a", lineHeight: 1.1 }}>
              Cloud<span style={{ color: "#4f46e5" }}>Cart</span>
            </h1>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>Microservices Store</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: "480px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search products by title, category, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-subtle)"
            }}
          />
          <svg style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            fill: "none",
            stroke: "#94a3b8",
            strokeWidth: 2
          }} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={onOpenOrders}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#f8fafc",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155"
                }}
              >
                ?? My Orders
              </button>
              <div style={{ textAlign: "right", fontSize: "13px" }}>
                <div style={{ fontWeight: "700", color: "#0f172a" }}>{user?.email?.split("@")[0]}</div>
                <div style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>JWT Active</div>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)"
              }}
            >
              Sign In / Register
            </button>
          )}

          {/* Cart Button with Count Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: "relative",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              fontSize: "14px"
            }}
          >
            <span>?? Cart</span>
            {totalCount > 0 && (
              <span style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "2px 7px",
                borderRadius: "var(--radius-full)",
                lineHeight: 1
              }}>
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #f1f5f9",
        padding: "8px 24px",
        overflowX: "auto"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          <button
            onClick={() => setSelectedCategory("ALL")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: "600",
              backgroundColor: selectedCategory === "ALL" ? "#4f46e5" : "#f1f5f9",
              color: selectedCategory === "ALL" ? "#ffffff" : "#475569"
            }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "13px",
                fontWeight: "600",
                backgroundColor: selectedCategory === cat ? "#4f46e5" : "#f1f5f9",
                color: selectedCategory === cat ? "#ffffff" : "#475569"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
