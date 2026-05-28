package com.saikiran.expense_service.controller;

import com.saikiran.expense_service.dto.FundSpendSummary;
import com.saikiran.expense_service.enums.DateRange;
import com.saikiran.expense_service.responseDTO.DashboardResponse;
import com.saikiran.expense_service.responseDTO.ExpenseResponse;
import com.saikiran.expense_service.services.CustomDateService;
import com.saikiran.expense_service.services.DashboardService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
            @RequestHeader("x-user-id")
            String userId
    ) {

        return ResponseEntity.ok(

                dashboardService
                        .getDashboard(userId)
        );
    }
}