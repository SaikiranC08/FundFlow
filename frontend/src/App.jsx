import Signup from "./features/auth/pages/Signup";
import Login from "./features/auth/pages/Login";
import Landing from "./features/auth/pages/Landing";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ExpensesPage from "./features/expenses/pages/ExpensesPage";
import FundsPage from "./features/funds/pages/FundsPage";
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage";
import ReportsPage from "./features/reports/pages/ReportsPage";

import PublicRoute from "./features/auth/routes/PublicRoute";
import ProtectedRoute from "./features/auth/routes/ProtectedRoute";

import DashboardLayout from "./shared/components/layout/DashboardLayout";
import CreateExpensePage from "./features/expenses/pages/CreateExpensePage";
import EditExpensePage
from "./features/expenses/pages/EditExpensePage";
import CreateFundPage
from "./features/funds/pages/CreateFundPage";
import EditFundPage
from "./features/funds/pages/EditFundPage";
import FundDetailsPage
from "./features/funds/pages/FundDetailsPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Landing />} />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute> <DashboardLayout /> </ProtectedRoute>}>

                    <Route path="/home" element={<DashboardPage />} />

                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/expenses/create" element={<CreateExpensePage />}/>
                    <Route path="/expenses/edit/:expenseId" element={<EditExpensePage />} />

                    <Route path="/funds" element={<FundsPage />} />
                    <Route
                        path="/funds/create"
                        element={<CreateFundPage />}
                        />

                        <Route
                            path="/funds/edit/:fundId"
                            element={<EditFundPage />}
                            />
                            <Route
                                path="/funds/:fundId"
                                element={<FundDetailsPage />}
                                />

                    <Route path="/analytics" element={<AnalyticsPage />} />

                    <Route path="/reports" element={<ReportsPage />} />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;