import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { useToast } from "../../../shared/components/feedback/toastContext";
import Spinner from "../../../shared/components/states/Spinner";
import { login } from "../api/login";
import { signup } from "../api/signup";
import { validateToken } from "../services/validateService";

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Determine active auth mode from route purely as derived state
  const authMode = location.pathname === "/signup" ? "signup" : "login";
  const [checkingToken, setCheckingToken] = useState(true);

  // Form states
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});

  // Auth skip logic if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const isValid = await validateToken();
        if (isValid) {
          navigate("/home");
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setCheckingToken(false);
      }
    }
    checkSession();
  }, [navigate]);

  // Handle Input Changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (signupErrors[name]) {
      setSignupErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Switch tabs smoothly
  const handleTabChange = (mode) => {
    setSignupErrors({});
    setLoginErrors({});
    navigate(mode === "signup" ? "/signup" : "/login");
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({});

    if (!loginData.username) {
      setLoginErrors((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!loginData.password) {
      setLoginErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      console.error("Login submission error:", err);
      toast.error("Unable to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupErrors({});

    // Inline Validations
    const errors = {};
    if (!signupData.userName) {
      errors.userName = "Username is required";
    }
    if (!signupData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!signupData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await signup(signupData);
      toast.success("Signup successful");
      navigate("/home");
    } catch (err) {
      console.error("Signup submission error:", err);
      toast.error("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-500">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans relative overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3.5 md:px-12 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15 shadow-sm">
              <Wallet className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              FundFlow
            </span>
          </div>


        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center py-6 lg:py-16">
        
        {/* Left Pane (Hero Title + Subtitle): Section 1 */}
        <section className="lg:col-span-6 flex flex-col justify-center space-y-5 text-left order-1">
          <span id="land1" className="sr-only">
            modern fintech landing experience
          </span>

          <h1 id="land2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Track smarter. <br />
            <span className="text-emerald-600">Spend better.</span>
          </h1>

          <p id="land3" className="text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
            Modern personal finance management with analytics, fund tracking, and financial reporting. Enjoy full security, seamless audits, and beautiful metrics at your fingertips.
          </p>
        </section>

        {/* Bottom Left Pane (Product Feature Bullets): Section 3 */}
        <section className="lg:col-span-6 flex flex-col justify-center order-3 lg:-mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <TrendingUp className="size-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Expense Analytics</h4>
                <p className="text-xs text-slate-500 mt-0.5">Visualize your spending instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <Wallet className="size-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Fund Utilization</h4>
                <p className="text-xs text-slate-500 mt-0.5">Allocate savings with purpose</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <FileText className="size-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">PDF Reports</h4>
                <p className="text-xs text-slate-500 mt-0.5">Export custom records cleanly</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                <Shield className="size-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Financial Security</h4>
                <p className="text-xs text-slate-500 mt-0.5">Industry-standard protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Embedded Auth Card: Section 2 */}
        <section id="land4" className="lg:col-span-6 flex items-center justify-center w-full order-2 lg:row-span-2">
          <div id="land5" className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/30 p-5 sm:p-6 md:p-8 w-full max-w-md relative overflow-hidden transition-all duration-300">
            {/* Top Toggle Header */}
            <div className="flex border-b border-slate-100 mb-6 pb-1">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`flex-1 text-center pb-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  authMode === "login"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("signup")}
                className={`flex-1 text-center pb-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  authMode === "signup"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Dynamic Card Body Form */}
            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4.5 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">Welcome Back</h3>
                  <p className="text-xs text-slate-400">Access your secure financial space</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    disabled={loading}
                    placeholder="Enter your username"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      loginErrors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    }`}
                  />
                  {loginErrors.username && (
                    <p className="text-xs font-medium text-red-600">{loginErrors.username}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      disabled={loading}
                      placeholder="Enter your password"
                      className={`w-full border rounded-xl pl-4 pr-11 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        loginErrors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none disabled:cursor-not-allowed"
                    >
                      {showLoginPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs font-medium text-red-600">{loginErrors.password}</p>
                  )}
                </div>

                <button
                  id="land6"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition duration-200 font-semibold text-sm disabled:cursor-not-allowed disabled:opacity-60 shadow-sm shadow-emerald-700/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner className="size-4 text-white" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("signup")}
                      className="text-emerald-600 hover:text-emerald-700 font-bold transition focus:outline-none"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4.5 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">Create an Account</h3>
                  <p className="text-xs text-slate-400">Join FundFlow to manage funds cleanly</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={signupData.userName}
                    onChange={handleSignupChange}
                    disabled={loading}
                    placeholder="Choose a username"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      signupErrors.userName ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    }`}
                  />
                  {signupErrors.userName && (
                    <p className="text-xs font-medium text-red-600">{signupErrors.userName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    disabled={loading}
                    placeholder="Enter your email"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      signupErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    }`}
                  />
                  {signupErrors.email && (
                    <p className="text-xs font-medium text-red-600">{signupErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={signupData.phoneNumber}
                    onChange={handleSignupChange}
                    disabled={loading}
                    placeholder="Enter phone number"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                      signupErrors.phoneNumber ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                    }`}
                  />
                  {signupErrors.phoneNumber && (
                    <p className="text-xs font-medium text-red-600">{signupErrors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      disabled={loading}
                      placeholder="Minimum 6 characters"
                      className={`w-full border rounded-xl pl-4 pr-11 py-2.5 text-sm outline-none transition-all duration-200 bg-white placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                        signupErrors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none disabled:cursor-not-allowed"
                    >
                      {showSignupPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p className="text-xs font-medium text-red-600">{signupErrors.password}</p>
                  )}
                </div>

                <button
                  id="land7"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition duration-200 font-semibold text-sm disabled:cursor-not-allowed disabled:opacity-60 shadow-sm shadow-emerald-700/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner className="size-4 text-white" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("login")}
                      className="text-emerald-600 hover:text-emerald-700 font-bold transition focus:outline-none"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Modern Clean Footer */}
      <footer className="bg-white/40 border-t border-slate-200/50 py-6 px-6 md:px-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-emerald-600" />
            <span>FundFlow securely processes active finance entries.</span>
          </div>
          <p>© 2026 FundFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
