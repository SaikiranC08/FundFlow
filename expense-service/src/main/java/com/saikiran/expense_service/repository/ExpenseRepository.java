package com.saikiran.expense_service.repository;


import com.saikiran.expense_service.dto.CategoryExpenseTotal;
import com.saikiran.expense_service.entities.ExpenseInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends CrudRepository<ExpenseInfo,Long> {

     List<ExpenseInfo> findExpenseInfoByUserId(String userId);

    //for deleting the expense
    //first : check expense exist ?

     boolean existsByExpenseIdAndUserId(Long Id,String userId);

     @Query("select coalesce(sum(e.amount),0) from ExpenseInfo e where e.userId = :userId ")
     Double sumAmountByUserId(@Param("userId") String userId);


    //second : perform delete operation
    void deleteByExpenseIdAndUserId(Long Id,String userId);


    //updating the Expense

    ExpenseInfo findExpenseInfoByExpenseIdAndUserId(Long expenseId, String userId);

    Optional<ExpenseInfo> findByIdempotencyKey(String key);


    Page<ExpenseInfo> findByUserId(String userId, Pageable pageable);


    // dashboard controller
    List<ExpenseInfo> findByUserIdAndDateBetween(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
SELECT new  com.saikiran.expense_service.dto.CategoryExpenseTotal(
    e.category.name,
    SUM(e.amount)
)
FROM ExpenseInfo e
WHERE e.userId = :userId
GROUP BY e.category
""")
    List<CategoryExpenseTotal> findCategoryTotals(String userId);


    List<ExpenseInfo> findExpenseInfoByUserIdAndFund_FundId(String userId,Long fundId);

    List<ExpenseInfo>
    findTop5ByUserIdOrderByDateDesc(
            String userId
    );
}
