package com.practice.ecommerceplatform.service;

import com.practice.ecommerceplatform.dto.CategoryRequest;
import com.practice.ecommerceplatform.entity.Category;
import com.practice.ecommerceplatform.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getCategoryName())) {
            throw new RuntimeException("Category already exists with name: " + request.getCategoryName());
        }

        String slug = request.getCategoryName().toLowerCase().replaceAll("[^a-z0-9]", "-");

        Category category = Category.builder()
                .name(request.getCategoryName())
                .slug(slug)
                .description(request.getCategoryDescription())
                .build();

        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }
}
