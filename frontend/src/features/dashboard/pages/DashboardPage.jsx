import {
  useEffect,
  useState
} from "react";

import {
  getDashboard
} from "../api/getDashboard";

import DashboardStats
from "../components/DashboardStats";

import RecentExpenses
from "../components/RecentExpenses";

import RecentFunds
from "../components/RecentFunds";

function DashboardPage() {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchDashboard() {

      try {

        const response =
          await getDashboard();

        setDashboard(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    fetchDashboard();

  }, []);

  if (loading) {

    return (

      <div className="p-8">
        Loading dashboard...
      </div>
    );
  }

  const dashboardData =
    dashboard || {
      monthlyExpense: 0,
      weeklyExpense: 0,
      activeFunds: 0,
      remainingFundAmount: 0,
      recentExpenses: [],
      recentFunds: []
    };

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

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Financial summary and recent activity
          </p>

        </div>

        <DashboardStats
          dashboard={dashboardData}
        />

        <RecentExpenses
          expenses={dashboardData.recentExpenses || []}
        />

        <RecentFunds
          funds={dashboardData.recentFunds || []}
        />

      </div>

    </div>
  );
}

export default DashboardPage;
