# ?? E-Commerce Cloud Microservices Platform

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.2.5](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud 2023](https://img.shields.io/badge/Spring%20Cloud-2023.0.1-blue.svg)](https://spring.io/projects/spring-cloud)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)

A enterprise-grade, distributed **E-Commerce Microservices Platform** built with **Spring Boot 3**, **Spring Cloud**, **OpenFeign**, **Spring Cloud Gateway**, and **Docker**.

---

## ??? Architecture Overview

```
                          [ Client / Frontend / Postman ]
                                         ¦
                                         ?
                             [ API Gateway : 8080 ]
                       (JWT Authentication & Routing)
                                         ¦
       +---------------------------------+-------------------------------+
       ¦               ¦                 ¦                ¦              ¦
       ?               ?                 ?                ?              ?
 [ User Service ] [ Product Service ] [ Order Service ] [ Payment Svc ] [ Inventory Svc ]
   (Port 8081)       (Port 8082)         (Port 8083)      (Port 8084)     (Port 8085)
       ¦                                     ¦                ¦              ?
       ¦                                     ¦(OpenFeign)     ¦(OpenFeign)   ¦
       ¦                                     +-------------------------------¦
       ¦                                     ?                               ¦
       ¦                              [ Inventory Svc ]                      ¦
       ¦                                                                     ¦
       ¦                                 (OpenFeign)                         ¦
       ¦                              [ Payment Service ] --? [ Notification Svc ]
       ¦                                                          (Port 8086)
       ?                                                               
  [ MySQL DB : 3306 ] ?------- (Service Discovery : Eureka Server 8761)
```

---

## ?? Services & Ports

| Service | Port | Description |
|---|---|---|
| **`eureka-server`** | `8761` | Netflix Eureka Service Registry & Discovery |
| **`api-gateway`** | `8080` | Spring Cloud Gateway, JWT Token Validation Filter |
| **`user-service`** | `8081` | Authentication (JWT), User Profiles, Addresses |
| **`product-service`** | `8082` | Product Catalog, Categories, Search |
| **`order-service`** | `8083` | Cart Management, Order Checkout & Tracking |
| **`payment-service`** | `8084` | Payment Processing & Order Status Updates |
| **`inventory-service`** | `8085` | Stock Level Tracking, Auto-Deduction on Checkout |
| **`notification-service`**| `8086` | Email Notifications (Gmail SMTP / Fallback logger) |

---

## ?? Security & JWT Authentication

- **Stateless Gateway Auth:** All requests pass through `api-gateway` (Port `8080`).
- **Public Endpoints (No Token Required):**
  - `POST /api/users/login`
  - `POST /api/users/register`
  - `GET /api/products/**`
  - `GET /api/categories/**`
- **Protected Endpoints (Bearer Token Required):**
  - `/api/cart/**`
  - `/api/orders/**`
  - `/api/payments/**`
  - `/api/inventory/**`
  - Header: `Authorization: Bearer <your-jwt-token>`

---

## ?? End-to-End Workflow

### 1. User Registration & Login
```http
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "Password123!",
  "fullName": "Alex Morgan"
}
```

```http
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "Password123!"
}
```
*Response includes `"token": "eyJhbGciOi..."`*. Use this token as `Bearer <token>` for subsequent requests.

### 2. Add Stock to Inventory
```http
POST http://localhost:8080/api/inventory/add
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "productId": 1,
  "productName": "Wireless Noise Cancelling Headphones",
  "quantity": 50
}
```

### 3. Add to Cart
```http
POST http://localhost:8080/api/cart/add
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

### 4. Checkout Order (Auto-Deducts Inventory)
```http
POST http://localhost:8080/api/orders/checkout
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": 1
}
```
*Response returns order with status `PENDING` and order `id` (e.g. `1`).*

### 5. Process Payment (Auto-Updates Status & Triggers Notification)
```http
POST http://localhost:8080/api/payments/process
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "orderId": 1,
  "userId": 1,
  "amount": 199.98,
  "paymentMode": "UPI"
}
```
*Flow executed:*
1. Payment validated with `order-service` via OpenFeign.
2. Order status updated from `PENDING` to `PROCESSING`.
3. Notification dispatched to `notification-service` to send payment receipt email.

---

## ?? Running with Docker Compose

Ensure Docker Desktop is running, then run:

```bash
# Start all 8 microservices + MySQL in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

---

## ?? Running Locally (IntelliJ IDEA)

1. Ensure MySQL is running on port `3306` with database `commerce_db`.
2. Start services in this order:
   1. `EurekaServerApplication` (Port 8761)
   2. `ApiGatewayApplication` (Port 8080)
   3. `ECommercePlatformApplication` (user-service, Port 8081)
   4. `ProductServiceApplication` (Port 8082)
   5. `OrderServiceApplication` (Port 8083)
   6. `PaymentServiceApplication` (Port 8084)
   7. `InventoryServiceApplication` (Port 8085)
   8. `NotificationServiceApplication` (Port 8086)
3. Open Eureka dashboard at: `http://localhost:8761` to verify all 7 services registered.
