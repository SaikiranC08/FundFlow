package com.saikiran.expense_service.controller;

import com.saikiran.expense_service.requestDTO.CreateExpenseRequest;
import com.saikiran.expense_service.responseDTO.ExpenseResponse;
import com.saikiran.expense_service.responseDTO.PaginatedResponse;
import com.saikiran.expense_service.services.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;


    // Create Expense

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestHeader("x-user-id") @NonNull String userId,
            @RequestHeader("Idempotency-Key") String key,
            @RequestBody CreateExpenseRequest request
    ) {
        // userId always comes from gateway
        request.setUserId(userId);
        request.setIdempotencyKey(key);

        return ResponseEntity.ok(
                expenseService.addExpense(request,key)
        );
    }


    // Get All Expenses

    @GetMapping("/expenses")
    public ResponseEntity<PaginatedResponse<ExpenseResponse>> getExpenses(
            @RequestHeader("x-user-id") String userId,

            // Pagination & sorting → QUERY PARAMS (correct)
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            @RequestParam(name = "sortBy", defaultValue = "date") String sortBy
    ) {
        return ResponseEntity.ok(
                expenseService.getExpenses(userId, page, size, sortBy)
        );
    }


    @GetMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpensesByExpenseId(@RequestHeader("x-user-id") String userId,@PathVariable Long expenseId){
        ExpenseResponse response = expenseService.getExpenseByExpenseId(userId,expenseId);
        return ResponseEntity.ok(response);
    }




    // Update Expense (PATCH)

    @PatchMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @RequestHeader("x-user-id") @NonNull String userId,
            @PathVariable Long expenseId,
            @RequestBody CreateExpenseRequest request
    ) {
        return ResponseEntity.ok(
                expenseService.updateExpense(userId, expenseId, request)
        );
    }


    // Delete Expense

    @DeleteMapping("/expenses/{expenseId}")
    public ResponseEntity<ExpenseResponse> deleteExpense(
            @RequestHeader("x-user-id") @NonNull String userId,
            @PathVariable Long expenseId
    ) {
        return ResponseEntity.ok(
                expenseService.deleteExpense(userId, expenseId)
        );
    }


    // Category-wise totals

    @GetMapping("/expenses/categories-total")
    public ResponseEntity<?> getCategoryTotals(
            @RequestHeader("x-user-id") @NonNull String userId
    ) {
        return ResponseEntity.ok(
                expenseService.getCategoriesExpense(userId)
        );
    }

    @GetMapping("/fund/{fundId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByFundId(@RequestHeader("x-user-id") @NonNull String userId, @PathVariable Long fundId){
        return ResponseEntity.ok(expenseService.getExpenseByfundId(userId,fundId));
    }


    // Health Check

    @GetMapping("/health")
    public ResponseEntity<Void> health() {
        return ResponseEntity.ok().build();
    }
}
