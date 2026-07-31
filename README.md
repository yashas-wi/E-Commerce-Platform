# 🛒 E-Commerce Platform Backend

[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, scalable E-Commerce Platform RESTful API backend built using **Spring Boot**, **Spring Data JPA**, **Spring Security (JWT)**, and **MySQL**. Designed following clean layered architecture (`Controller` -> `Service` -> `Repository` -> `Entity`) and DTO design patterns.

---

## 🌟 Key Features

### 👤 User & Auth Management
- **Authentication:** Stateless authentication using JWT (JSON Web Tokens).
- **Role-Based Access Control (RBAC):** `ROLE_CUSTOMER`, `ROLE_ADMIN`, and `ROLE_SELLER`.
- **User Profiles & Address Book:** Multi-address management per user.

### 📦 Product & Catalog Management
- **Categories & Brands:** Multi-tier product categorization.
- **Product Variants:** Attribute-based inventory tracking (SKU, Size, Color, Stock).
- **Search & Filtering:** Dynamic query filtering for active products.

### 🛒 Cart & Wishlist
- **Persistent Shopping Cart:** Sync items across guest and user sessions.
- **Wishlist:** Save products for future purchase.

### 🧾 Order & Payment System
- **Checkout Engine:** Order creation with inventory reservation and total calculations.
- **Order Status State Machine:** `PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`.
- **Payment Integration Ready:** Structured for Stripe/Razorpay webhooks.

---

## 🛠️ Tech Stack & Dependencies

- **Language:** Java 21 / 24
- **Framework:** Spring Boot 3.x / 4.x
- **Security:** Spring Security, BCrypt, JJWT (JSON Web Token)
- **Database & ORM:** MySQL, Spring Data JPA, Hibernate
- **Utilities:** Lombok, MapStruct, Jakarta Bean Validation
- **Documentation:** SpringDoc OpenAPI (Swagger UI)

---

## 🚀 Getting Started

### Prerequisites
- Java JDK 17+ or 21+ installed
- MySQL Server 8.0+ running on `localhost:3306`
- Maven or Gradle

### Database Setup
Create a MySQL database named `commerce_db`:
```sql
CREATE DATABASE commerce_db;
