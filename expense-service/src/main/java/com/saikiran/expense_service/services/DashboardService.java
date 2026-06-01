package com.saikiran.expense_service.services;

import com.saikiran.expense_service.repository.ExpenseRepository;
import com.saikiran.expense_service.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import com.saikiran.expense_service.entities.ExpenseInfo;
import com.saikiran.expense_service.entities.FundInfo;
import com.saikiran.expense_service.enums.FundStatus;
import com.saikiran.expense_service.mapper.ExpenseMapper;
import com.saikiran.expense_service.mapper.FundMapper;
import com.saikiran.expense_service.responseDTO.DashboardResponse;
import com.saikiran.expense_service.responseDTO.ExpenseResponse;
import com.saikiran.expense_service.responseDTO.FundResponse;
import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final FundRepository fundRepository;
    private final ExpenseMapper expenseMapper;
    private final FundMapper fundMapper;

    public DashboardResponse getDashboard(String userId) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate weekStart = now.minusDays(7);

        // Monthly Expenses
        BigDecimal monthlyExpense = expenseRepository.findExpenseInfoByUserId(userId)
                .stream()
                .filter(expense -> expense.getDate().isAfter(monthStart.minusDays(1)))
                .map(ExpenseInfo::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Weekly Expenses
        BigDecimal weeklyExpense = expenseRepository.findExpenseInfoByUserId(userId)
                .stream()
                .filter(expense -> expense.getDate().isAfter(weekStart.minusDays(1)))
                .map(ExpenseInfo::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Active Funds

        List<FundInfo> activeFundsList = fundRepository.findByUserId(userId)

                                                       .stream()
                                                       // SKIP SELF FUNDS
                                                       .filter(fund ->
                                                               !"SELF".equalsIgnoreCase(
                                                                       fund.getOwnerType()
                                                               )
                                                       )
                                                       // ONLY ACTIVE
                                                       .filter(fund ->
                                                               fund.getStatus() == FundStatus.ACTIVE
                                                       )
                                                       .toList();

        Long activeFunds = (long) activeFundsList.size();

        // Remaining Fund Amount
        BigDecimal remainingFundAmount = activeFundsList.stream()
                .map(FundInfo::getRemainingAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Recent Expenses
        List<ExpenseResponse> recentExpenses = expenseRepository.findTop5ByUserIdOrderByDateDesc(userId)
                .stream()
                .map(expenseMapper::toExpenseResponse)
                .toList();

        // Recent Funds
        List<FundResponse> recentFunds = fundRepository.findTop3ByUserIdOrderByCreatedDateDesc(userId)
                .stream()
                .filter(fund -> !fund.getOwnerType().equals("SELF"))
                .map(fundMapper::toFundResponse)
                .toList();

        return DashboardResponse.builder()
                .monthlyExpense(monthlyExpense)
                .weeklyExpense(weeklyExpense)
                .activeFunds(activeFunds)
                .remainingFundAmount(remainingFundAmount)
                .recentExpenses(recentExpenses)
                .recentFunds(recentFunds)
                .build();
    }
}