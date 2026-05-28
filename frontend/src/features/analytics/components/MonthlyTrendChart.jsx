import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function MonthlyTrendChart({ weeklyAnalytics }) {

  const data =
    weeklyAnalytics.map((item) => ({
      day: item.day,
      amount: Number(item.amount || 0)
    }));

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
          Daily Spending Trend
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Weekly movement in daily expenses
        </p>

      </div>

      {data.length === 0 ? (

        <div className="h-96 flex items-center justify-center text-gray-500">
          No weekly analytics found.
        </div>

      ) : (

        <div className="h-96">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 16,
                left: 8,
                bottom: 0
              }}
            >

              <defs>
                <linearGradient
                  id="spendingTrendFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 12
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#6b7280",
                  fontSize: 12
                }}
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#16a34a"
                strokeWidth={3}
                fill="url(#spendingTrendFill)"
                fillOpacity={1}
                dot={{
                  r: 4,
                  fill: "#16a34a"
                }}
                animationDuration={700}
                activeDot={{
                  r: 6
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}

export default MonthlyTrendChart;
