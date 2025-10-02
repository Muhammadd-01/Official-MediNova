"use client";
import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext, DarkModeContext } from "../App";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false); // State for success notification
  const [showError, setShowError] = useState(null); // State for error notification

  // Auth0 hooks
  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

  // Clear Auth0 session on page load to prevent unintended social login triggers
  useEffect(() => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin + "/Login" });
    }
  }, [isAuthenticated, logout]);

  // Save social user to backend after Auth0 login
  useEffect(() => {
    if (isAuthenticated && user) {
      const saveSocialUser = async () => {
        try {
          const res = await axios.post("http://localhost:4000/api/auth/social-login", {
            fullName: user.name,
            email: user.email,
            authProvider: user.sub.split("|")[0],
            auth0Id: user.sub,
          });

          // Save JWT in localStorage & context
          localStorage.setItem("token", res.data.token);
          login({
            fullName: res.data.user.fullName,
            email: res.data.user.email,
            token: res.data.token,
          });

          setShowSuccess(true); // Show success notification
          setTimeout(() => {
            setShowSuccess(false);
            navigate("/"); // Redirect to home after 3 seconds
          }, 3000);
        } catch (err) {
          console.error("Error saving social user:", err);
          // Do not set showError for social login failures
        }
      };
      saveSocialUser();
    }
  }, [isAuthenticated, user, login, navigate]);

  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);

      login({
        email: res.data.user.email,
        fullName: res.data.user.fullName,
        token: res.data.token,
      });

      setShowSuccess(true); // Show success notification
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/"); // Redirect to home after 3 seconds
      }, 3000);
    } catch (err) {
      console.error(err);
      setShowError(err.response?.data?.msg || "Invalid email or password ❌");
      setTimeout(() => setShowError(null), 3000); // Auto-dismiss error
    }
  };

  // Social login buttons
  const handleSocialLogin = (provider) => {
    loginWithRedirect({
      connection: provider,
      redirectUri: "http://localhost:5173/", // dev frontend URL
    });
  };

  // Styling
  const bgColor = darkMode ? "bg-[#0A2A43]/70 backdrop-blur-lg" : "bg-white/60 backdrop-blur-lg";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";
  const inputGlass =
    "w-full px-4 py-3 border rounded-xl sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#00C2CB] border-gray-300/40 bg-white/30 backdrop-blur-lg shadow-inner placeholder-gray-500 text-[#0D3B66] dark:bg-[#0A2A43]/60 dark:text-[#FDFBFB] dark:placeholder-gray-300";
  const cardBg = darkMode
    ? "bg-[#0A2A43]/20 backdrop-blur-[10px] border border-white/20"
    : "bg-white/20 backdrop-blur-md border border-gray-200";

  return (
    <>
      <Helmet>
        <title>Login - MediNova</title>
        <meta name="description" content="Log in to your MediNova account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl border border-gray-200/20 ${bgColor} ${textColor}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            Sign in to your account
          </h2>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google-oauth2")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium text-[#0D3B66] bg-white/50 backdrop-blur-md border border-gray-200/30 hover:bg-white/70 hover:scale-105 transition-all shadow-md"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium text-white bg-[#1877F2] hover:bg-[#0D65D9] hover:scale-105 transition-all shadow-md"
            >
              <FaFacebook className="mr-2 h-5 w-5" /> Sign in with Facebook
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("twitter")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium text-white bg-[#1DA1F2] hover:bg-[#0D8DD9] hover:scale-105 transition-all shadow-md"
            >
              <FaTwitter className="mr-2 h-5 w-5" /> Sign in with Twitter
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-3 rounded-xl text-sm shadow-sm ${darkMode ? "bg-[#0A2A43]/70" : "bg-white/60"}`}>
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Email/password Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className={inputGlass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className={inputGlass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:scale-105 hover:shadow-lg transition-all"
              >
                Sign in
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${cardBg} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#00C2CB] mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>Login Successful ✅</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  Welcome back! You are now signed in.
                </p>
              </div>
              <motion.button
                onClick={() => setShowSuccess(false)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close notification"
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification */}
      <AnimatePresence>
        {showError && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] ${cardBg} shadow-2xl`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>Login Failed ❌</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  {showError}
                </p>
              </div>
              <motion.button
                onClick={() => setShowError(null)}
                className="p-1 rounded-full bg-[#00C2CB]/20 hover:bg-[#00C2CB]/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close notification"
              >
                <X className="w-5 h-5 text-[#00C2CB]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Login;