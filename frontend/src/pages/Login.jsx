"use client";

import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext, DarkModeContext } from "../App";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email });
    navigate("/");
  };

  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-white bg-opacity-90 backdrop-blur-md";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";
  const inputDark = "border-[#395B75] bg-[#0D3B66] text-[#FDFBFB] placeholder-gray-300";
  const inputLight = "border-gray-300 bg-white text-[#0D3B66] placeholder-gray-500";

  return (
    <>
      <Helmet>
        <title>Login - MediNova</title>
        <meta name="description" content="Log in to your MediNova account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg transition-all duration-300 ${bgColor} ${textColor}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00C2CB] focus:border-[#00C2CB] focus:z-10 sm:text-sm ${darkMode ? inputDark : inputLight}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00C2CB] focus:border-[#00C2CB] focus:z-10 sm:text-sm ${darkMode ? inputDark : inputLight}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0D3B66] focus:ring-[#0D3B66] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-[#0D3B66]"}`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#0D3B66] hover:text-[#00C2CB] transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0D3B66] hover:bg-[#00C2CB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3B66] transition-all"
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
