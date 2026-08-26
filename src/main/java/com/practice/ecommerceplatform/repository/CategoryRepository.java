package com.practice.ecommerceplatform.repository;

import com.google.common.base.Optional;
import com.practice.ecommerceplatform.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    Boolean existsByName(String name);
}
