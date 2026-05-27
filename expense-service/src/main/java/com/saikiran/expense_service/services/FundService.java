package com.saikiran.expense_service.services;


import com.saikiran.expense_service.entities.ExpenseInfo;
import com.saikiran.expense_service.entities.FundInfo;
import com.saikiran.expense_service.enums.FundStatus;
import com.saikiran.expense_service.exception.DuplicateFundException;
import com.saikiran.expense_service.exception.FundNotFoundException;
import com.saikiran.expense_service.exception.InsufficientFundException;
import com.saikiran.expense_service.mapper.FundMapper;
import com.saikiran.expense_service.repository.FundRepository;
import com.saikiran.expense_service.requestDTO.CreateFundRequest;
import com.saikiran.expense_service.responseDTO.FundResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class FundService {


    private final FundMapper fundMapper;
    private final FundRepository fundRepository;


    @Transactional
    public Long getOrCreateSelfFundId(String userId) {

        return fundRepository
                .findFundIdByUserIdAndOwnerTypeForUpdate(userId, "SELF")
                .orElseGet(() -> {

                    FundInfo fund = FundInfo.builder()
                                            .userId(userId)
                                            .ownerType("SELF")
                                            .ownerName(null)
                                            .amountReceived(null)
                                            .remainingAmount(null)
                                            .createdDate(LocalDate.now())
                                            .status(FundStatus.ACTIVE)
                                            .build();

                    return fundRepository.save(fund).getFundId();
                });
    }

    @Transactional(readOnly = true)
    public Long getOtherFundInfo(String userId, String ownerName) {

        if (ownerName == null || ownerName.isBlank()) {
            throw new IllegalArgumentException("ownerName is required for OTHER expenses");
        }

        FundInfo fund = fundRepository
                .findByUserIdAndOwnerTypeAndOwnerName(
                        userId,
                        "OTHER",
                        ownerName
                )
                .orElseThrow(() ->
                        new FundNotFoundException(
                                "Fund not found for owner: " + ownerName
                        )
                );

        return fund.getFundId();
    }


    @Transactional
    public FundResponse addFund(
            CreateFundRequest dto
    ) {

        // SELF fund
        if ("SELF".equals(dto.getOwnerType())) {

            dto.setOwnerName(null);

            // CHECK EXISTING SELF
            Optional<FundInfo> existingSelf =
                    fundRepository
                            .findByUserIdAndOwnerType(
                                    dto.getUserId(),
                                    "SELF"
                            );

            // RETURN EXISTING
            if (existingSelf.isPresent()) {

                return fundMapper.toFundResponse(
                        existingSelf.get()
                );
            }
        }

        if (
                fundRepository.existsByUserIdAndOwnerTypeAndOwnerName(
                        dto.getUserId(),
                        dto.getOwnerType(),
                        dto.getOwnerName()
                )
        ) {

            throw new DuplicateFundException(
                    "Fund already exists"
            );
        }

        // OTHER validation
        if ("OTHER".equals(dto.getOwnerType())
                && dto.getOwnerName() == null) {

            throw new IllegalArgumentException(
                    "Owner name is required for OTHER fund"
            );
        }

        FundInfo fundInfo =
                fundMapper.toFundInfo(dto);

        // initialize remainingAmount
        fundInfo.setRemainingAmount(
                fundInfo.getAmountReceived()
        );

        fundInfo.setStatus(FundStatus.ACTIVE);

        fundInfo.setCreatedDate(
                LocalDate.now()
        );

        fundRepository.save(fundInfo);

        return fundMapper.toFundResponse(
                fundInfo
        );
    }


    @Transactional
    public FundResponse updateFund(CreateFundRequest dto,Long fundId){
        // bring the update data
        String userId = dto.getUserId();
        FundInfo fundInfo = fundRepository.findFundInfoByUserIdAndFundId(userId,fundId);

        if (fundInfo == null) {
            throw new FundNotFoundException("Fund not found");
        }
        // update the user request
        fundMapper.updateFundFromDto(dto,fundInfo);
        // save the data
        fundRepository.save(fundInfo);
        // return updated data
        return fundMapper.toFundResponse(fundInfo);
    }

    @Transactional
    public void deleteFund(String userId, Long fundId){
        FundInfo fundInfo = fundRepository.findFundInfoByUserIdAndFundId(userId, fundId);

        if (fundInfo == null) {
            throw new FundNotFoundException("Fund not found");
        }

        fundRepository.delete(fundInfo);

    }

    public List<FundResponse> getFundList(String userId){
        List<FundInfo> fundInfoList = fundRepository.findFundInfoByUserId(userId);

        return fundInfoList.stream()
                           .map(fundMapper::toFundResponse)
                           .toList();
    }

    @Transactional
    public void deductAmount(Long fundId, BigDecimal amount) {
        int updated = fundRepository.deductRemainingAmount(fundId, amount);

        if (updated == 0) {
           throw new InsufficientFundException("Insufficient balance or fund not found");
        }
    }

    @Transactional
    public void restoreAmount( ExpenseInfo expense){
        fundRepository.restoreRemainingAmount(
                expense.getFund().getFundId(),
                expense.getAmount()
        );
    }

    public List<String> getOwnerName(String userId){
        return fundRepository.findDistinctOwnerNames(userId);
    }

    public FundResponse getFundById(String userId, Long fundId) {
        FundInfo fundInfo = fundRepository.getFundByUserIdAndFundId(userId,fundId);
        return fundMapper.toFundResponse(fundInfo);
    }
}

