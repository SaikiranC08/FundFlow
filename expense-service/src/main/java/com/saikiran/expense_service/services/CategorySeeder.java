package com.saikiran.expense_service.services;

import com.saikiran.expense_service.entities.Category;
import com.saikiran.expense_service.enums.CategorySource;
import com.saikiran.expense_service.enums.DefaultCategory;
import com.saikiran.expense_service.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategorySeeder {

    private final CategoryRepository categoryRepository;

    @PostConstruct
    public void seedCategories() {
        for (DefaultCategory defaultCategory : DefaultCategory.values()) {
            boolean exists = categoryRepository.existsByNameIgnoreCase(defaultCategory.getDisplayName());

            if (!exists) {
                Category category = new Category();
                category.setName(defaultCategory.getDisplayName());
                category.setSource(CategorySource.SYSTEM);
                categoryRepository.save(category);
            }
        }
    }
}
