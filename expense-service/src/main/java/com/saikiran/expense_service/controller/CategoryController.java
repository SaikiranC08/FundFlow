package com.saikiran.expense_service.controller;

import com.saikiran.expense_service.requestDTO.CreateCategoryRequest;
import com.saikiran.expense_service.responseDTO.CategoryResponse;
import com.saikiran.expense_service.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestHeader("x-user-id") String userId,
            @RequestBody CreateCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.createCategory(userId, request));
    }
}