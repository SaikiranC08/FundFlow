import {
  CalendarDays,
  PiggyBank,
  Wallet,
  WalletCards
} from "lucide-react";

function DashboardStats({ dashboard }) {

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const stats = [
    {
      label: "Monthly Expense",
      value: formatCurrency(dashboard.monthlyExpense),
      icon: Wallet,
      iconClass: "bg-green-100 text-green-600"
    },
    {
      label: "Weekly Expense",
      value: formatCurrency(dashboard.weeklyExpense),
      icon: CalendarDays,
      iconClass: "bg-blue-100 text-blue-600"
    },
    {
      label: "Active Funds",
      value: dashboard.activeFunds || 0,
      icon: WalletCards,
      iconClass: "bg-orange-100 text-orange-600"
    },
    {
      label: "Remaining Funds",
      value: formatCurrency(dashboard.remainingFundAmount),
      icon: PiggyBank,
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
        gap-6
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

            <div>

              <p className="text-sm text-gray-400">
                {stat.label}
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  text-gray-900
                  mt-3
                "
              >
                {stat.value}
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
              <Icon size={24} strokeWidth={1.8} />
            </div>

          </div>

        </div>

        );
      })}

    </div>
  );
}

export default DashboardStats;
