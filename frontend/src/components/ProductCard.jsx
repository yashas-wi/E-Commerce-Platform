import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [stockInfo, setStockInfo] = useState(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Fetch real-time stock from inventory-service via gateway
    const fetchInventory = async () => {
      try {
        setLoadingStock(true);
        const res = await api.get(`/api/inventory/${product.id}`);
        setStockInfo(res.data);
      } catch (err) {
        // Fallback if not configured in inventory table yet
        setStockInfo({ quantity: 15, inStock: true });
      } finally {
        setLoadingStock(false);
      }
    };
    fetchInventory();
  }, [product.id]);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setAdding(false), 300);
  };

  const isOutOfStock = stockInfo && stockInfo.quantity <= 0;

  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }}
    >
      {/* Product Image */}
      <div style={{
        position: "relative",
        height: "220px",
        backgroundColor: "#f8fafc",
        overflow: "hidden"
      }}>
        <img
          src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease"
          }}
        />

        {/* Stock Badge */}
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: isOutOfStock ? "#ef4444" : (stockInfo?.quantity < 5 ? "#f59e0b" : "#10b981"),
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "700",
          padding: "4px 8px",
          borderRadius: "var(--radius-full)",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}>
          {isOutOfStock ? "Out of Stock" : (stockInfo ? `${stockInfo.quantity} in stock` : "Checking stock...")}
        </div>

        {/* Category Pill */}
        <div style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(4px)",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: "600",
          padding: "3px 8px",
          borderRadius: "var(--radius-sm)"
        }}>
          {product.category || "Electronics"}
        </div>
      </div>

      {/* Product Details */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "6px",
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "16px",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {product.description || "Premium high-grade item built with exceptional durability and modern design."}
        </p>

        {/* Price and Cart Button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          borderTop: "1px solid #f1f5f9"
        }}>
          <div>
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Price</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || adding}
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: isOutOfStock ? "#cbd5e1" : "#4f46e5",
              color: isOutOfStock ? "#64748b" : "#ffffff",
              fontWeight: "600",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              boxShadow: isOutOfStock ? "none" : "0 2px 4px rgba(79, 70, 229, 0.25)"
            }}
          >
            {adding ? "Adding..." : (isOutOfStock ? "Sold Out" : "+ Add to Cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
