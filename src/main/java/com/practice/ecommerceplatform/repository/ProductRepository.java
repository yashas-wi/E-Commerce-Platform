package com.practice.ecommerceplatform.repository;
import com.google.common.base.Optional;
import com.practice.ecommerceplatform.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    Optional<Product> findBySlug(String slug);
}
