package com.saikiran.expense_service.services;

import com.saikiran.expense_service.enums.DateRange;
import com.saikiran.expense_service.mapper.ExpenseMapper;
import com.saikiran.expense_service.repository.ExpenseRepository;
import com.saikiran.expense_service.responseDTO.ExpenseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomDateService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public List<ExpenseResponse> getExpensesByRange(
            String userId,
            DateRange range,
            LocalDate startDate,
            LocalDate endDate
    ) {
        LocalDate start;
        LocalDate end = LocalDate.now();

        switch (range) {
            case TODAY -> start = end;
            case LAST_7_DAYS -> start = end.minusDays(7);
            case LAST_30_DAYS -> start = end.minusDays(30);
            case CUSTOM -> {
                if (startDate == null || endDate == null) {
                    throw new IllegalArgumentException("Start and End date required for CUSTOM range");
                }
                if (startDate.isAfter(endDate)) {
                    throw new IllegalArgumentException("Start date cannot be after end date");
                }
                start = startDate;
                end = endDate;
            }
            default -> throw new IllegalArgumentException("Invalid date range");
        }

        return expenseRepository.findByUserIdAndDateBetween(userId, start, end)
                .stream()
                .map(expenseMapper::toExpenseResponse)
                .toList();
    }
}
