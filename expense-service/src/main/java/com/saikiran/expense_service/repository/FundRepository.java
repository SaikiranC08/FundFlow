package com.saikiran.expense_service.repository;

import com.saikiran.expense_service.dto.FundSpendSummary;
import com.saikiran.expense_service.entities.FundInfo;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface FundRepository extends CrudRepository<FundInfo, Long> {

    List<FundInfo> findByUserId(String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select f.fundId
        from FundInfo f
        where f.userId = :userId
          and f.ownerType = :ownerType
    """)
    Optional<Long> findFundIdByUserIdAndOwnerTypeForUpdate(
            @Param("userId") String userId,
            @Param("ownerType") String ownerType
    );

    FundInfo findFundInfoByUserIdAndFundId(String userId, Long fundId);

    Optional<FundInfo> findByUserIdAndOwnerTypeAndOwnerName(
            String userId,
            String ownerType,
            String ownerName
    );

    FundInfo deleteFundInfoByFundIdAndUserId(Long fundId, String userId);

    List<FundInfo> findFundInfoByUserId(String userId);

    @Modifying
    @Query("""
   UPDATE FundInfo f
   SET f.remainingAmount = f.remainingAmount - :amount
   WHERE f.fundId = :fundId
     AND f.remainingAmount >= :amount
""")
    int deductRemainingAmount(
            @Param("fundId") Long fundId,
            @Param("amount") BigDecimal amount
    );


    @Modifying
    @Query("""
   UPDATE FundInfo f
   SET f.remainingAmount = f.remainingAmount + :amount
   WHERE f.fundId = :fundId
""")
    int restoreRemainingAmount(
            @Param("fundId") Long fundId,
            @Param("amount") BigDecimal amount
    );


    //for dashboard

    // Query
    @Query("""
    SELECT new com.saikiran.expense_service.dto.FundSpendSummary(
        f.fundId,
        COALESCE(f.ownerName, 'SELF'),
        (f.amountReceived - f.remainingAmount),
        f.amountReceived,
        f.remainingAmount
    )
    FROM FundInfo f
    WHERE f.userId = :userId
""")
    List<FundSpendSummary> findFundSpendSummary(@Param("userId") String userId);

    Optional<FundInfo> findByUserIdAndOwnerType(
            String userId,
            String ownerType
    );


    @Query("""
    SELECT DISTINCT f.ownerName
    FROM FundInfo f
    WHERE f.userId = :userId
""")
    List<String> findDistinctOwnerNames(
            @Param("userId") String userId
    );

    boolean existsByUserIdAndOwnerTypeAndOwnerName(String userId, String ownerType, String ownerName);

    FundInfo getFundByUserIdAndFundId(String userId, Long fundId);

    List<FundInfo> findTop3ByUserIdOrderByCreatedDateDesc(String userId);

}