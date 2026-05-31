package com.saikiran.expense_service.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // BUSINESS ERRORS (clear messages)
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(FundNotFoundException.class)
    public ResponseEntity<String> handleFundNotFound(FundNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }

    @ExceptionHandler(InsufficientFundException.class)
    public ResponseEntity<String> handleInsufficientFund(InsufficientFundException ex){
        return ResponseEntity.status(413).body(ex.getMessage());
    }

    // DATABASE / TECHNICAL ERRORS (generic message)
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleDatabaseError(DataAccessException e) {

        e.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.toString());

    }

    // FALLBACK (never expose internals)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericcatch (Exception e) { e.printStackTrace(); return ResponseEntity.internalServerError() .body(e.getMessage()); }

    @ExceptionHandler(
            DuplicateFundException.class
    )
    public ResponseEntity<String>
    handleDuplicateFund(
            DuplicateFundException ex
    ) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}

