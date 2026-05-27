package com.saikiran.expense_service.exception;

public class DuplicateFundException
        extends RuntimeException {

    public DuplicateFundException(
            String message
    ) {
        super(message);
    }
}
