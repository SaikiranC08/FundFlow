import {
  Circle,
  Film,
  HeartPulse,
  Plane,
  ShoppingBag,
  UtensilsCrossed
} from "lucide-react";

function TopCategories({ categoryTotals }) {

  const categories =
    Object.entries(categoryTotals || {})
      .map(([category, amount]) => ({
        category,
        amount: Number(amount || 0)
      }))
      .sort((first, second) =>
        second.amount - first.amount
      );

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const topAmount =
    categories.length > 0
      ? categories[0].amount
      : 0;

  function getCategoryMeta(category) {

    const normalizedCategory =
      category.toLowerCase();

    if (normalizedCategory === "food") {

      return {
        icon: UtensilsCrossed,
        iconClass: "bg-orange-100 text-orange-600",
        barClass: "bg-orange-500"
      };
    }

    if (normalizedCategory === "travel") {

      return {
        icon: Plane,
        iconClass: "bg-blue-100 text-blue-600",
        barClass: "bg-blue-500"
      };
    }

    if (normalizedCategory === "shopping") {

      return {
        icon: ShoppingBag,
        iconClass: "bg-purple-100 text-purple-600",
        barClass: "bg-purple-500"
      };
    }

    if (normalizedCategory === "health") {

      return {
        icon: HeartPulse,
        iconClass: "bg-red-100 text-red-500",
        barClass: "bg-red-400"
      };
    }

    if (normalizedCategory === "entertainment") {

      return {
        icon: Film,
        iconClass: "bg-green-100 text-green-600",
        barClass: "bg-green-500"
      };
    }

    return {
      icon: Circle,
      iconClass: "bg-gray-100 text-gray-600",
      barClass: "bg-gray-500"
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
          Top Spending Categories
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Categories ranked by spend
        </p>

      </div>

      {categories.length === 0 ? (

        <div className="py-10 text-center text-gray-500">
          No categories found.
        </div>

      ) : (

        <div className="space-y-5">

          {categories.map((item) => {

            const percentage =
              topAmount > 0
                ? Math.round((item.amount / topAmount) * 100)
                : 0;

            const categoryMeta =
              getCategoryMeta(item.category);

            const Icon =
              categoryMeta.icon;

            return (

              <div key={item.category}>

                <div className="flex items-center justify-between gap-4 mb-2">

                  <div className="flex items-center gap-3 min-w-0">

                    <span
                      className={`
                        w-8 h-8
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${categoryMeta.iconClass}
                      `}
                    >
                      <Icon size={17} strokeWidth={1.9} />
                    </span>

                    <p className="font-medium text-gray-800 truncate">
                      {item.category}
                    </p>

                  </div>

                  <p className="font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </p>

                </div>

                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">

                  <div
                    className={`
                      h-full
                      rounded-full
                      ${categoryMeta.barClass}
                    `}
                    style={{
                      width: `${percentage}%`
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default TopCategories;
