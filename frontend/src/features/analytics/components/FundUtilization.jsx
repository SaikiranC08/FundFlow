function FundUtilization({ funds }) {

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
          Fund Utilization
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Track used and remaining entrusted funds
        </p>

      </div>

      {funds.length === 0 ? (

        <div className="py-12 text-center text-gray-500">
          No fund utilization found.
        </div>

      ) : (

        <div className="space-y-5">

          {funds.map((fund) => {

            const percentage =
              Math.min(
                Number(fund.utilizationPercentage || 0),
                100
              );

            return (

              <div
                key={fund.ownerName}
                className="
                  rounded-3xl
                  border border-gray-100
                  bg-gray-50
                  p-5
                "
              >

                <div className="flex items-start justify-between gap-4 mb-4">

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {fund.ownerName}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(fund.used)} used
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold text-gray-900">
                      {percentage}%
                    </p>

                    <p className="text-xs text-gray-400">
                      utilized
                    </p>

                  </div>

                </div>

                <div className="h-3 rounded-full bg-white overflow-hidden border border-gray-100">

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-green-500
                    "
                    style={{
                      width: `${percentage}%`
                    }}
                  />

                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <div>

                    <p className="text-xs text-gray-400">
                      Used Amount
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {formatCurrency(fund.used)}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-gray-400">
                      Remaining
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {formatCurrency(fund.remaining)}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default FundUtilization;
