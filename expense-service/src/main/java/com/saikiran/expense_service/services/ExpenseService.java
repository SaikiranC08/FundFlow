package com.saikiran.expense_service.services;

import com.saikiran.expense_service.entities.ExpenseInfo;
import com.saikiran.expense_service.entities.FundInfo;
import com.saikiran.expense_service.enums.OwnerType;
import com.saikiran.expense_service.mapper.ExpenseMapper;
import com.saikiran.expense_service.repository.ExpenseRepository;
import com.saikiran.expense_service.repository.FundRepository;
import com.saikiran.expense_service.requestDTO.CreateExpenseRequest;
import com.saikiran.expense_service.responseDTO.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.saikiran.expense_service.entities.Category;
import com.saikiran.expense_service.repository.CategoryRepository;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
@AllArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final FundService fundService;
    private final CategoryRepository categoryRepository;
    private final FundRepository fundRepository;

    @Transactional
    public ExpenseResponse addExpense(CreateExpenseRequest expenseDTO, String idempotencyKey) {
        Optional<ExpenseInfo> existing = expenseRepository.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            return expenseMapper.toExpenseResponse(existing.get());
        }

        Long fundId;

        // SELF expense
        if (expenseDTO.getOwnerType() == OwnerType.SELF) {
            fundId = fundService.getOrCreateSelfFundId(expenseDTO.getUserId());
        }
        // OTHER expense
        else if (expenseDTO.getOwnerType() == OwnerType.OTHER) {
            fundId = fundService.getOtherFundInfo(expenseDTO.getUserId(), expenseDTO.getOwnerName());
            // deduct balance
            fundService.deductAmount(fundId, expenseDTO.getAmount());
        } else {
            throw new IllegalArgumentException("Invalid ownerType");
        }

        // FETCH CATEGORY
        Category category = categoryRepository.findById(expenseDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // FETCH FUND ENTITY
        FundInfo fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        // DTO -> ENTITY
        ExpenseInfo expenseInfo = expenseMapper.toExpenseInfo(expenseDTO);

        // SET RELATIONSHIPS
        expenseInfo.setCategory(category);
        expenseInfo.setFund(fund);

        // OTHER FIELDS
        expenseInfo.setUserId(expenseDTO.getUserId());
        expenseInfo.setIdempotencyKey(idempotencyKey);
        expenseInfo.setDate(expenseDTO.getDate() != null ? expenseDTO.getDate() : LocalDate.now());

        // SAVE
        expenseRepository.save(expenseInfo);

        // RESPONSE
        return expenseMapper.toExpenseResponse(expenseInfo);
    }

    public PaginatedResponse<ExpenseResponse> getExpenses(String userId, int pageNo, int size, String sortBy) {
        // 1️⃣ Guardrails
        if (pageNo < 0) pageNo = 0;
        if (size <= 0 || size > 50) size = 50;

        // 2️⃣ Pageable creation
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(sortBy).descending());

        // 3️⃣ Fetch from DB
        Page<ExpenseInfo> page = expenseRepository.findByUserId(userId, pageable);

        // 4️⃣ Map entity → response DTO
        List<ExpenseResponse> data = page.getContent()
                .stream()
                .map(expenseMapper::toExpenseResponse)
                .toList();

        // 5️⃣ Build pagination metadata
        PaginationMeta meta = PaginationMeta.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();

        // 6️⃣ Final response
        return PaginatedResponse.<ExpenseResponse>builder()
                .data(data)
                .pagination(meta)
                .build();
    }

    public ExpenseResponse getExpenseByExpenseId(String userId, Long expenseId) {
       ExpenseInfo expenseInfo = expenseRepository.findExpenseInfoByExpenseIdAndUserId(expenseId, userId);
       return expenseMapper.toExpenseResponse(expenseInfo);
    }

    public List<ExpenseResponse> getExpenseByfundId(String userId, Long fundId) {
        List<ExpenseInfo> expenseInfo = expenseRepository.findExpenseInfoByUserIdAndFund_FundId(userId, fundId);
        return expenseInfo.stream()
                .map(expenseMapper::toExpenseResponse)
                .toList();
    }

    // delete expense
    @Transactional
    public ExpenseResponse deleteExpense(String userId, Long id) {
        ExpenseInfo expenseInfo = expenseRepository.findExpenseInfoByExpenseIdAndUserId(id, userId);
        if (expenseInfo == null) {
            throw new RuntimeException("Expense not found");
        }

        // Restore fund balance only for OTHER owner expenses.
        if (expenseInfo.getOwnerType() == OwnerType.OTHER) {
            fundService.restoreAmount(expenseInfo);
        }

        expenseRepository.deleteByExpenseIdAndUserId(id, userId);
        return expenseMapper.toExpenseResponse(expenseInfo);
    }

    // update expense
    public ExpenseResponse updateExpense(String userId, Long id, CreateExpenseRequest expenseDTO) {
        ExpenseInfo expenseInfo = expenseRepository.findExpenseInfoByExpenseIdAndUserId(id, userId);
        if (expenseInfo == null) {
            throw new RuntimeException("Expense not found");
        }

        expenseMapper.updateExpenseFromDto(expenseDTO, expenseInfo);
        expenseRepository.save(expenseInfo);
        return expenseMapper.toExpenseResponse(expenseInfo);
    }

    // Category wise expense
    public Map<String, BigDecimal> getCategoriesExpense(String userId) {
        List<ExpenseInfo> expenses = expenseRepository.findExpenseInfoByUserId(userId);
        Map<String, BigDecimal> categoryTotals = new HashMap<>();

        for (ExpenseInfo expense : expenses) {
            if (expense.getCategory() == null || expense.getAmount() == null) {
                continue;
            }
            categoryTotals.merge(
                    expense.getCategory().getName(),
                    expense.getAmount(),
                    BigDecimal::add
            );
        }
        return categoryTotals;
    }

    public List<MonthlyAnalyticsResponse> getMonthlyAnalytics(String userId) {
        List<ExpenseInfo> expenses = expenseRepository.findExpenseInfoByUserId(userId);
        Map<Month, BigDecimal> monthlyTotals = new HashMap<>();

        for (ExpenseInfo expense : expenses) {
            Month month = expense.getDate().getMonth();
            BigDecimal currentAmount = monthlyTotals.getOrDefault(month, BigDecimal.ZERO);
            monthlyTotals.put(month, currentAmount.add(expense.getAmount()));
        }

        return monthlyTotals.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> MonthlyAnalyticsResponse.builder()
                        .month(entry.getKey().name())
                        .amount(entry.getValue())
                        .build())
                .toList();
    }

    public List<WeeklyTrendResponse> getWeeklyTrend(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);

        List<ExpenseInfo> expenses = expenseRepository.findExpenseInfoByUserId(userId)
                .stream()
                .filter(expense -> !expense.getDate().isBefore(weekStart))
                .toList();

        Map<DayOfWeek, BigDecimal> totals = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            totals.put(day, BigDecimal.ZERO);
        }

        for (ExpenseInfo expense : expenses) {
            DayOfWeek day = expense.getDate().getDayOfWeek();
            totals.put(day, totals.get(day).add(expense.getAmount()));
        }

        return totals.entrySet()
                .stream()
                .map(entry -> WeeklyTrendResponse.builder()
                        .day(entry.getKey().name())
                        .amount(entry.getValue())
                        .build())
                .toList();
    }

    public Map.Entry<String, BigDecimal> getTopCategory(String userId) {
        Map<String, BigDecimal> categories = getCategoriesExpense(userId);
        return categories.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
    }
}
