import {
  Circle,
  Film,
  HeartPulse,
  Plane,
  ShoppingBag,
  UtensilsCrossed
} from "lucide-react";

function RecentExpenses({ expenses }) {

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  function getCategoryMeta(category = "") {

    const normalizedCategory =
      category.toLowerCase();

    if (normalizedCategory === "food") {

      return {
        icon: UtensilsCrossed,
        iconClass: "bg-orange-100 text-orange-600"
      };
    }

    if (normalizedCategory === "travel") {

      return {
        icon: Plane,
        iconClass: "bg-blue-100 text-blue-600"
      };
    }

    if (normalizedCategory === "shopping") {

      return {
        icon: ShoppingBag,
        iconClass: "bg-purple-100 text-purple-600"
      };
    }

    if (normalizedCategory === "health") {

      return {
        icon: HeartPulse,
        iconClass: "bg-red-100 text-red-500"
      };
    }

    if (normalizedCategory === "entertainment") {

      return {
        icon: Film,
        iconClass: "bg-green-100 text-green-600"
      };
    }

    return {
      icon: Circle,
      iconClass: "bg-gray-100 text-gray-600"
    };
  }

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
          Recent Activity
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Latest money movement
        </p>

      </div>

      {expenses.length === 0 ? (

        <div className="py-10 text-center text-gray-500">
          No recent expenses found.
        </div>

      ) : (

        <div className="space-y-3">

          {expenses.map((expense) => {

            const categoryMeta =
              getCategoryMeta(expense.category);

            const Icon =
              categoryMeta.icon;

            return (

              <div
                key={expense.expenseId}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  p-3
                  hover:bg-gray-50
                  transition
                "
              >

                <div className="flex items-center gap-4 min-w-0">

                  <span
                    className={`
                      w-11 h-11
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      shrink-0
                      ${categoryMeta.iconClass}
                    `}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </span>

                  <div className="min-w-0">

                    <p className="font-semibold text-gray-900 truncate">
                      {expense.description}
                    </p>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        text-xs
                        text-gray-400
                        mt-1
                      "
                    >
                      <span>{expense.category}</span>
                      <span>{expense.date}</span>
                      <span>{expense.ownerType}</span>
                    </div>

                  </div>

                </div>

                <p className="font-bold text-red-500 whitespace-nowrap">
                  {formatCurrency(expense.amount)}
                </p>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default RecentExpenses;
