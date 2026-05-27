import { useEffect, useState } from "react";
import { getExpenses } from "../api/getExpenses";
import { useNavigate } from "react-router-dom";
import { deleteExpense }
from "../api/deleteExpense";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";

function ExpenseTable() {

  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({});

  const navigate = useNavigate();

  useEffect(() => {

    async function fetchExpenses() {

      try {

        const response = await getExpenses();

        setExpenses(response.expenses);

        setPagination(response.pagination);

      } catch (error) {

        console.error(error);

      }
    }

    fetchExpenses();

  }, []);

  const getCategoryColor = (category) => {

    switch (category) {

      case "Food":
        return "bg-red-100 text-red-600";

      case "Travel":
        return "bg-blue-100 text-blue-600";

      case "Shopping":
        return "bg-purple-100 text-purple-600";

      case "Health":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  async function handleDelete(
  expenseId
) {

  const confirmed =
    window.confirm(
      "Delete this expense?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await deleteExpense(
      expenseId
    );

    setExpenses((prev) =>

      prev.filter(

        (expense) =>

          expense.expenseId !== expenseId
      )
    );

  } catch (error) {

    console.error(error);
  }
}

  return (

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Expenses
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Track and manage your expenses
          </p>

        </div>

        <button
  onClick={() => navigate("/expenses/create")}
  className="
    flex items-center gap-2
    bg-green-600 hover:bg-green-700
    text-white
    px-4 py-2
    rounded-xl
    transition
  "
>
  Add Expense
</button>

      </div>

      {/* Search + Filters */}

      <div className="flex items-center justify-between mb-6">

        <div
          className="
            flex items-center gap-2
            border border-gray-200
            rounded-xl
            px-3 py-2
            w-80
          "
        >
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search expenses..."
            className="
              outline-none
              border-none
              w-full
              text-sm
            "
          />
        </div>

        <div className="flex items-center gap-3">

          <button
            className="
              flex items-center gap-2
              border border-gray-200
              px-4 py-2
              rounded-xl
              text-sm
              text-gray-600
            "
          >
            <Calendar size={16} />
            This Month
          </button>

        </div>

      </div>

      {/* Table */}

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
                Date
              </th>

              <th className="pb-4 font-medium">
                Description
              </th>

              <th className="pb-4 font-medium">
                Category
              </th>

              <th className="pb-4 font-medium">
                Amount
              </th>

              <th className="pb-4 font-medium">
                Owner
              </th>

              <th className="pb-4 font-medium text-center">
                Actions
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

                <td className="py-5 text-sm text-gray-600">
                  {expense.date}
                </td>

                <td className="py-5">

                  <div>

                    <p className="font-medium text-gray-800">
                      {expense.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Expense ID: {expense.expenseId}
                    </p>

                  </div>

                </td>

                <td className="py-5">

                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getCategoryColor(expense.category)}
                    `}
                  >
                    {expense.category}
                  </span>

                </td>

                <td
                  className="
                    py-5
                    font-semibold
                    text-red-500
                  "
                >
                  ₹{expense.amount}
                </td>

                <td className="py-5">

                  <span
                    className="
                      bg-gray-100
                      text-gray-700
                      text-xs
                      px-3 py-1
                      rounded-full
                    "
                  >
                    {expense.ownerType}
                  </span>

                </td>

                <td className="py-5">

                  <div
                    className="
                      flex items-center
                      justify-center
                      gap-3
                    "
                  >

                    <button
                    onClick={() =>
                    navigate(
                       `/expenses/edit/${expense.expenseId}`
                        )
         }
                      className="
                        p-2
                        rounded-lg
                        bg-gray-100
                        hover:bg-gray-200
                        transition
                      "
                    >
                      <Pencil
                        size={16}
                        className="text-gray-600"
                      />
                    </button>

                    <button
                    onClick={() =>
                        handleDelete(
                          expense.expenseId
                        )
                      }
                      className="
                        p-2
                        rounded-lg
                        bg-red-100
                        hover:bg-red-200
                        transition
                      "
                    >
                      <Trash2
                        size={16}
                        className="text-red-500"
                      />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div
        className="
          flex items-center
          justify-between
          mt-6
        "
      >

        <p className="text-sm text-gray-500">

          Showing page{" "}

          <span className="font-medium text-gray-700">
            {pagination.page + 1}
          </span>

          {" "}of{" "}

          <span className="font-medium text-gray-700">
            {pagination.totalPages}
          </span>

        </p>

        <div className="flex items-center gap-2">

  <button
    disabled={!pagination.hasPrevious}
    className={`
      px-4 py-2
      rounded-xl
      text-sm
      border

      ${
        pagination.hasPrevious
          ? "border-gray-200 text-gray-700 hover:bg-gray-50"
          : "border-gray-100 text-gray-300 cursor-not-allowed"
      }
    `}
  >
    Previous
  </button>

  <button
    className="
      px-4 py-2
      bg-green-600
      text-white
      rounded-xl
      text-sm
    "
  >
    {pagination.page + 1}
  </button>

  <button
    disabled={!pagination.hasNext}
    className={`
      px-4 py-2
      rounded-xl
      text-sm
      border

      ${
        pagination.hasNext
          ? "border-gray-200 text-gray-700 hover:bg-gray-50"
          : "border-gray-100 text-gray-300 cursor-not-allowed"
      }
    `}
  >
    Next
  </button>

</div>

      </div>

    </div>
  );
}

export default ExpenseTable;