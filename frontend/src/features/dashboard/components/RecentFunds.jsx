function RecentFunds({ funds }) {

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (

    <div
      className="
        bg-white
        rounded-3xl
        shadow-sm
        border border-gray-100
        p-6
      "
    >

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Fund Health
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Current active fund status
        </p>

      </div>

      {funds.length === 0 ? (

        <div className="py-10 text-center text-gray-500">
          No recent funds found.
        </div>

      ) : (

        <div className="space-y-4">

          {funds.map((fund) => {

            const usedAmount =
              Number(fund.amountReceived || 0) -
              Number(fund.remainingAmount || 0);

            const usedPercentage =
              Number(fund.amountReceived || 0) > 0
                ? Math.round(
                    (usedAmount / Number(fund.amountReceived)) * 100
                  )
                : 0;

            return (

              <div
                key={fund.fundId}
                className="
                  rounded-3xl
                  border border-gray-100
                  bg-gray-50
                  p-5
                "
              >

                <div className="flex items-start justify-between gap-4 mb-4">

                  <div className="min-w-0">

                    <h3 className="font-semibold text-gray-900 truncate">
                      {fund.ownerName}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(fund.remainingAmount)} remaining
                    </p>

                  </div>

                  <div className="text-right shrink-0">

                    <p className="text-xl font-bold text-gray-900">
                      {usedPercentage}%
                    </p>

                    <p className="text-xs text-gray-400">
                      used
                    </p>

                  </div>

                </div>

                <div className="h-3 rounded-full bg-white overflow-hidden border border-gray-100">

                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${Math.min(usedPercentage, 100)}%`
                    }}
                  />

                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">

                  <span>
                    Used {formatCurrency(usedAmount)}
                  </span>

                  <span>
                    Total {formatCurrency(fund.amountReceived)}
                  </span>

                </div>

              </div>

            );
          })}


        </div>

      )}

    </div>
  );
}

export default RecentFunds;
