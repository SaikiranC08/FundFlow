package com.saikiran.expense_service.controller;

import com.saikiran.expense_service.services.reports.ExpensePdfService;
import com.saikiran.expense_service.services.reports.FundPdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ExpensePdfService expensePdfService;
    private final FundPdfService fundPdfService;

    @GetMapping("/expenses")
    public ResponseEntity<byte[]> downloadExpenseReport(
            @RequestHeader("x-user-id") String userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        byte[] pdf = expensePdfService.generateExpenseReport(userId, startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=expense-report.pdf")
                .contentLength(pdf.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/fund/{fundId}")
    public ResponseEntity<byte[]> downloadFundReport(
            @RequestHeader("x-user-id") String userId,
            @PathVariable Long fundId
    ) {
        byte[] pdf = fundPdfService.generateFundReport(userId, fundId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fund-report.pdf")
                .contentLength(pdf.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
