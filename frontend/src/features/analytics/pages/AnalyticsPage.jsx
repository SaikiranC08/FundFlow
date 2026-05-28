import {
  useEffect,
  useState
} from "react";

import {
  getCategoryTotals
} from "../api/getCategoryTotals";

import {
  getMonthlyAnalytics
} from "../api/getMonthlyAnalytics";

import {
  getWeeklyAnalytics
} from "../api/getWeeklyAnalytics";

import {
  getFundUtilization
} from "../api/getFundUtilization";

import AnalyticsStats
from "../components/AnalyticsStats";

import CategoryPieChart
from "../components/CategoryPieChart";

import FundUtilization
from "../components/FundUtilization";

import MonthlyTrendChart
from "../components/MonthlyTrendChart";

import TopCategories
from "../components/TopCategories";

function AnalyticsPage() {

  const [monthlyAnalytics, setMonthlyAnalytics] =
    useState([]);

  const [categoryTotals, setCategoryTotals] =
    useState({});

  const [weeklyAnalytics, setWeeklyAnalytics] =
    useState([]);

  const [fundUtilization, setFundUtilization] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchAnalytics() {

      try {

        const [
          monthlyResponse,
          categoryResponse,
          weeklyResponse,
          utilizationResponse
        ] = await Promise.all([
          getMonthlyAnalytics(),
          getCategoryTotals(),
          getWeeklyAnalytics(),
          getFundUtilization()
        ]);

        setMonthlyAnalytics(monthlyResponse || []);
        setCategoryTotals(categoryResponse || {});
        setWeeklyAnalytics(weeklyResponse || []);
        setFundUtilization(utilizationResponse || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    fetchAnalytics();

  }, []);

  if (loading) {

    return (

      <div className="p-8">
        Loading analytics...
      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-8
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          space-y-8
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              Analytics
            </h1>

            <p className="text-gray-500 mt-1">
              Analyze spending patterns and financial insights
            </p>

          </div>

          <button
            className="
              bg-white
              border border-gray-100
              shadow-sm
              rounded-2xl
              px-5 py-3
              text-sm
              font-medium
              text-gray-700
              w-fit
            "
          >
            This Month
          </button>

        </div>

        <AnalyticsStats
          monthlyAnalytics={monthlyAnalytics}
          categoryTotals={categoryTotals}
        />

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          <CategoryPieChart
            categoryTotals={categoryTotals}
          />

          <MonthlyTrendChart
            weeklyAnalytics={weeklyAnalytics}
          />

        </div>

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[1.15fr_0.85fr]
            gap-6
          "
        >

          <FundUtilization
            funds={fundUtilization}
          />

          <TopCategories
            categoryTotals={categoryTotals}
          />

        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;
