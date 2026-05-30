package com.saikiran.expense_service.controller;

import com.saikiran.expense_service.responseDTO.DashboardResponse;
import com.saikiran.expense_service.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@RequestHeader("x-user-id") String userId) {
        return ResponseEntity.ok(dashboardService.getDashboard(userId));
    }
}