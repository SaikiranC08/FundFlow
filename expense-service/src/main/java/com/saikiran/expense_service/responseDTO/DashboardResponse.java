package com.saikiran.expense_service.responseDTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private BigDecimal monthlyExpense;

    private BigDecimal weeklyExpense;

    private Long activeFunds;

    private BigDecimal remainingFundAmount;

    private List<ExpenseResponse> recentExpenses;

    private List<FundResponse> recentFunds;
}
