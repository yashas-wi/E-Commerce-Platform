import React, { useState, useEffect } from "react";
import api from "./api/api";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AuthModal from "./components/AuthModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrdersModal from "./components/OrdersModal";
import { useAuth } from "./context/AuthContext";

const INITIAL_DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    category: "Electronics",
    description: "Industry-leading noise cancellation with dual processors and 8 microphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
  },
  {
    id: 2,
    name: "Apple MacBook Pro 14 M3",
    price: 1999.00,
    category: "Computers",
    description: "Blazing-fast M3 chip, Liquid Retina XDR display, up to 22 hours battery life.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
  },
  {
    id: 3,
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 99.99,
    category: "Accessories",
    description: "Ergonomic quiet clicks, 8K DPI tracking on glass, ultra-fast MagSpeed scroll wheel.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80"
  },
  {
    id: 4,
    name: "Keychron Q1 Pro Custom Mechanical Keyboard",
    price: 199.50,
    category: "Accessories",
    description: "Wireless QMK/VIA programmable custom mechanical keyboard with CNC aluminum body.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80"
  },
  {
    id: 5,
    name: "Samsung 49-inch Odyssey OLED G9 Curved Gaming Monitor",
    price: 1299.99,
    category: "Electronics",
    description: "Dual QHD 240Hz 0.03ms response time display with Neo Quantum Processor Pro.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80"
  },
  {
    id: 6,
    name: "Anker Prime 20,000mAh 200W Power Bank",
    price: 129.99,
    category: "Electronics",
    description: "Compact multi-device fast charging with smart digital display and App connectivity.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80"
  }
];

export default function App() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState(INITIAL_DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  useEffect(() => {
    // Fetch products from product-service via gateway
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch (err) {
        console.warn("Using curated product list (product-service empty or loading):", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
        color: "#ffffff",
        padding: "50px 24px"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            color: "#a5b4fc",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "16px"
          }}>
            SPRING CLOUD • DOCKER READY • OPENFEIGN
          </div>
          <h1 style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "12px", lineHeight: 1.2 }}>
            Distributed E-Commerce Microservices
          </h1>
          <p style={{ fontSize: "16px", color: "#cbd5e1", maxWidth: "680px", lineHeight: 1.6 }}>
            Browse items powered by <strong>Product Service</strong>, check live stock from <strong>Inventory Service</strong>, add to cart via <strong>Order Service</strong>, and securely pay with <strong>Payment Service</strong> — all through the <strong>Spring Cloud API Gateway</strong>.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
              {selectedCategory === "ALL" ? "All Products" : selectedCategory}
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>??</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#475569" }}>No products found</h3>
            <p style={{ fontSize: "14px" }}>Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        padding: "32px 24px",
        borderTop: "1px solid #1e293b",
        marginTop: "auto"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "16px" }}>CloudCart</span>
            <span style={{ fontSize: "13px", display: "block", marginTop: "4px" }}>
              Microservices Architecture Platform • Spring Boot 3 + React
            </span>
          </div>
          <div style={{ fontSize: "12px", textAlign: "right" }}>
            <span>Ports: Gateway 8080 • Users 8081 • Products 8082 • Orders 8083 • Payments 8084 • Inventory 8085 • Notifications 8086</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        onRequireAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
    </div>
  );
}
