package com.saikiran.expense_service.services;

import com.saikiran.expense_service.enums.CategorySource;
import com.saikiran.expense_service.repository.CategoryRepository;
import com.saikiran.expense_service.requestDTO.CreateCategoryRequest;
import com.saikiran.expense_service.responseDTO.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.saikiran.expense_service.entities.Category;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createCategory(String userId, CreateCategoryRequest request) {
        String name = request.getName().trim();

        boolean systemExists = categoryRepository.existsByNameIgnoreCase(name);
        if (systemExists) {
            throw new RuntimeException("Category already exists");
        }

        boolean userExists = categoryRepository.existsByNameIgnoreCaseAndUserId(name, userId);
        if (userExists) {
            throw new RuntimeException("User category already exists");
        }

        Category category = Category.builder()
                .name(name)
                .source(CategorySource.USER)
                .userId(userId)
                .build();

        Category saved = categoryRepository.save(category);

        return CategoryResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .source(saved.getSource().name())
                .build();
    }
}
