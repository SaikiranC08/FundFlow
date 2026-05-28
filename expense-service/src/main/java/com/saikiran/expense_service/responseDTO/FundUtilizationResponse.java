package com.saikiran.expense_service.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundUtilizationResponse {

    private String ownerName;

    private BigDecimal received;

    private BigDecimal remaining;

    private BigDecimal used;

    private Integer utilizationPercentage;
}