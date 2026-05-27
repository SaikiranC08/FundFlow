package com.saikiran.expense_service.controller;


import com.saikiran.expense_service.requestDTO.CreateFundRequest;
import com.saikiran.expense_service.responseDTO.FundResponse;
import com.saikiran.expense_service.services.FundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/v1/funds")
@RequiredArgsConstructor
public class FundController {

    private final FundService fundService;

    @GetMapping
    public ResponseEntity<List<FundResponse>> getFunds(
            @RequestHeader("x-user-id") String userId) {

        List<FundResponse> funds = fundService.getFundList(userId);
        return ResponseEntity.ok(funds);
    }

    @GetMapping("/ownerName")
    public ResponseEntity<List<String>> getOwnerName(@RequestHeader("x-user-id") String userId){
        return ResponseEntity.ok(fundService.getOwnerName(userId));
    }


    @PostMapping
    public ResponseEntity<FundResponse> addFund(
            @RequestHeader("x-user-id") String userId,
            @RequestBody CreateFundRequest dto) {
            dto.setUserId(userId);
        FundResponse response = fundService.addFund(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{fundId}")
    public ResponseEntity<FundResponse> updateFund(
            @PathVariable Long fundId,
            @RequestHeader("x-user-id") String userId,
            @RequestBody CreateFundRequest dto) {
        dto.setUserId(userId);
        FundResponse response = fundService.updateFund(dto, fundId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{fundId}")
    public ResponseEntity<Void> deleteFund(
            @PathVariable Long fundId,
            @RequestHeader("x-user-id") String userId) {

        fundService.deleteFund(userId, fundId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{fundId}")
    public ResponseEntity<FundResponse>
    getFundById(

            @PathVariable Long fundId,

            @RequestHeader("x-user-id")
            String userId
    ) {

        FundResponse response =
                fundService.getFundById(
                        userId,
                        fundId
                );

        return ResponseEntity.ok(
                response
        );
    }
}

