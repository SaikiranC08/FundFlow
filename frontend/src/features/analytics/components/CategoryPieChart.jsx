import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

function CategoryPieChart({ categoryTotals }) {

  const data =
    Object.entries(categoryTotals || {}).map(
      ([category, amount]) => ({
        category,
        amount: Number(amount || 0)
      })
    );

  const colors = [
    "#22c55e",
    "#60a5fa",
    "#f59e0b",
    "#a78bfa",
    "#fb7185",
    "#2dd4bf"
  ];

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const totalAmount =
    data.reduce(
      (total, item) =>
        total + item.amount,
      0
    );

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
          Expenses by Category
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Distribution of spending across categories
        </p>

      </div>

      {data.length === 0 ? (

        <div className="h-80 flex items-center justify-center text-gray-500">
          No category data found.
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">

          <div className="h-96 relative">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={88}
                  outerRadius={132}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={4}
                >

                  {data.map((entry, index) => (

                    <Cell
                      key={entry.category}
                      fill={colors[index % colors.length]}
                    />

                  ))}

                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />

              </PieChart>

            </ResponsiveContainer>

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                pointer-events-none
              "
            >

              <div className="text-center">

                <p className="text-xs text-gray-400">
                  Total
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalAmount)}
                </p>

              </div>

            </div>

          </div>

          <div className="space-y-4 self-center">

            {data.map((item, index) => (

              <div
                key={item.category}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  text-sm
                  rounded-2xl
                  bg-gray-50
                  px-4 py-3
                "
              >

                <div className="flex items-center gap-3 min-w-0">

                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        colors[index % colors.length]
                    }}
                  />

                  <span className="text-gray-600 truncate">
                    {item.category}
                  </span>

                </div>

                <span className="font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.amount)}
                </span>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default CategoryPieChart;
