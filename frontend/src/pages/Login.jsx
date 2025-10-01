"use client";
import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext, DarkModeContext } from "../App";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  // Auth0 hooks
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();

  // Save social user to backend after Auth0 login
  useEffect(() => {
    const saveSocialUser = async () => {
      if (isAuthenticated && user) {
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

          navigate("/"); // Redirect to home
        } catch (err) {
          console.error("Error saving social user:", err);
        }
      }
    };
    saveSocialUser();
  }, [isAuthenticated, user]);

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

      alert(res.data.msg);
      navigate("/"); // Redirect to home
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error while logging in ❌");
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
    </>
  );
}

export default Login;
