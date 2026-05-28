function RecentExpenses({ expenses }) {

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
          Recent Expenses
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Latest expense activity
        </p>

      </div>

      {expenses.length === 0 ? (

        <div className="py-10 text-center text-gray-500">
          No recent expenses found.
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  text-left
                  text-gray-500
                  text-sm
                  border-b border-gray-100
                "
              >

                <th className="pb-4 font-medium">
                  Amount
                </th>

                <th className="pb-4 font-medium">
                  Category
                </th>

                <th className="pb-4 font-medium">
                  Description
                </th>

                <th className="pb-4 font-medium">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {expenses.map((expense) => (

                <tr
                  key={expense.expenseId}
                  className="
                    border-b border-gray-50
                    hover:bg-gray-50
                    transition
                  "
                >

                  <td
                    className="
                      py-5
                      font-semibold
                      text-red-500
                      whitespace-nowrap
                    "
                  >
                    {formatCurrency(expense.amount)}
                  </td>

                  <td className="py-5">

                    <span
                      className="
                        bg-gray-100
                        text-gray-700
                        text-xs
                        font-medium
                        px-3 py-1
                        rounded-full
                      "
                    >
                      {expense.category}
                    </span>

                  </td>

                  <td className="py-5 text-sm text-gray-700">
                    {expense.description}
                  </td>

                  <td
                    className="
                      py-5
                      text-sm
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    {expense.date}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default RecentExpenses;
