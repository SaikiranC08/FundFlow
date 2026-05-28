function RecentFunds({ funds }) {

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  function getStatusColor(status) {

    switch (status) {

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "EXHAUSTED":
        return "bg-orange-100 text-orange-700";

      case "CLOSED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (

    <div>

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Recent Funds
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Latest fund activity
        </p>

      </div>

      {funds.length === 0 ? (

        <div
          className="
            bg-white
            rounded-3xl
            p-10
            text-center
            border border-gray-100
            text-gray-500
          "
        >
          No recent funds found.
        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {funds.map((fund) => (

            <div
              key={fund.fundId}
              className="
                bg-white
                rounded-3xl
                shadow-sm
                border border-gray-100
                p-6
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  mb-5
                "
              >

                <h3
                  className="
                    text-xl
                    font-semibold
                    text-gray-900
                  "
                >
                  {fund.ownerName}
                </h3>

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-medium
                    whitespace-nowrap
                    ${getStatusColor(fund.status)}
                  `}
                >
                  {fund.status}
                </span>

              </div>

              <div className="space-y-4">

                <div>

                  <p className="text-sm text-gray-400">
                    Amount Received
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(fund.amountReceived)}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-400">
                    Remaining Amount
                  </p>

                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {formatCurrency(fund.remainingAmount)}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentFunds;
