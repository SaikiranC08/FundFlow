import {
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  ReceiptText,
  Trophy
} from "lucide-react";

function AnalyticsStats({
  monthlyAnalytics,
  categoryTotals
}) {

  const categories =
    Object.entries(categoryTotals || {});

  const topCategory =
    categories.reduce(
      (highest, current) =>
        Number(current[1]) > Number(highest[1])
          ? current
          : highest,
      ["None", 0]
    );

  const latestMonthly =
    monthlyAnalytics.length > 0
      ? monthlyAnalytics[monthlyAnalytics.length - 1]
      : { amount: 0 };

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const monthlyTotal =
    Number(latestMonthly.amount || 0);

  const averageDaily =
    monthlyTotal / 30;

  const stats = [
    {
      label: "Total Expenses",
      value: formatCurrency(monthlyTotal),
      description: "Latest monthly spend",
      icon: CircleDollarSign,
      iconClass: "bg-green-100 text-green-600"
    },
    {
      label: "Average Daily Expense",
      value: formatCurrency(averageDaily),
      description: "Monthly total / 30",
      icon: ChartNoAxesColumnIncreasing,
      iconClass: "bg-blue-100 text-blue-600"
    },
    {
      label: "Highest Category",
      value: topCategory[0],
      description: formatCurrency(topCategory[1]),
      icon: Trophy,
      iconClass: "bg-orange-100 text-orange-600"
    },
    {
      label: "Total Transactions",
      value: categories.length,
      description: "Category count",
      icon: ReceiptText,
      iconClass: "bg-purple-100 text-purple-600"
    }
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
      "
    >

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (

          <div
            key={stat.label}
            className="
              bg-white
              rounded-3xl
              shadow-sm
              border border-gray-100
              p-6
            "
          >

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm text-gray-400">
                  {stat.label}
                </p>

                <p
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    mt-4
                    truncate
                  "
                >
                  {stat.value}
                </p>

                <p className="text-xs text-gray-400 mt-2 truncate">
                  {stat.description}
                </p>

              </div>

              <div
                className={`
                  p-3
                  rounded-2xl
                  shadow-sm
                  shrink-0
                  ${stat.iconClass}
                `}
              >
                <Icon size={22} strokeWidth={1.8} />
              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default AnalyticsStats;
