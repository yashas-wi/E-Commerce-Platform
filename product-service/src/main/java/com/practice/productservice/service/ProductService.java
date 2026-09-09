package com.practice.productservice.service;

import com.practice.productservice.dto.ProductRequest;
import com.practice.productservice.entity.Category;
import com.practice.productservice.entity.Product;
import com.practice.productservice.repository.CategoryRepository;
import com.practice.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-")
                + "-" + System.currentTimeMillis();

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .category(category)
                .isActive(true)
                .build();
        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }
}
