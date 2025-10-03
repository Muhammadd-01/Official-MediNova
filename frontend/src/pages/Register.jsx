"use client";

import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext, DarkModeContext } from "../App";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { CheckCircle, X } from "lucide-react";

// 🔹 Custom Liquid Glass Dropdown
function GlassSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-lg border border-gray-300/40 shadow-inner cursor-pointer dark:bg-[#0A2A43]/60"
      >
        {value || "Select Gender"}
      </div>
      {open && (
        <ul className="absolute mt-2 w-full rounded-xl bg-white/40 backdrop-blur-xl border border-gray-200/40 shadow-xl dark:bg-[#0A2A43]/80 z-10">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-white/60 dark:hover:bg-[#0A2A43]/60 cursor-pointer rounded-lg transition-all"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===================== Auth0 Wrapper =====================
export function Auth0ProviderWithConfig({ children }) {
  return (
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_CLIENT_ID"
      redirectUri={window.location.origin}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}

// ===================== Register Component =====================
function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: null,
    phoneNumber: "",
    gender: "",
    country: "",
    termsAccepted: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  // ===== Auth0 hooks =====
  const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  // Clear Auth0 session on page load
  useEffect(() => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin + "/Register" });
    }
  }, [isAuthenticated, logout]);

  // ===== Save social user to backend =====
  useEffect(() => {
    if (isAuthenticated && user) {
      const saveSocialUser = async () => {
        try {
          const token = await getAccessTokenSilently();
          await axios.post(
            "http://localhost:4000/api/auth/social-login",
            {
              fullName: user.name,
              email: user.email,
              authProvider: user.sub.split("|")[0],
              auth0Id: user.sub,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate("/Login");
          }, 3000);
        } catch (err) {
          console.error("Error saving social user:", err);
        }
      };
      saveSocialUser();
    }
  }, [isAuthenticated, getAccessTokenSilently, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // clear old errors

    if (!formData.termsAccepted) {
      setErrorMessage("You must accept terms and conditions.");
      return;
    }

    if (!formData.dateOfBirth) {
      setErrorMessage("Please select your Date of Birth.");
      return;
    }

    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth.toISOString(),
      };

      await axios.post("http://localhost:4000/api/auth/register", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        login({ email: formData.email });
        navigate("/Login");
      }, 3000);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data?.msg) {
        const msg = err.response.data.msg.toLowerCase();

        if (msg.includes("email")) {
          setErrorMessage("Email already exists");
        } else if (msg.includes("phone")) {
          setErrorMessage("Phone number already exists");
        } else {
          setErrorMessage("Registration failed. Try again.");
        }
      } else {
        setErrorMessage("Registration failed. Try again.");
      }

      // auto clear error after 3 sec
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleSocialLogin = (provider) => {
    loginWithRedirect({ connection: provider });
  };

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
        <title>Register - MediNova</title>
        <meta name="description" content="Create a new MediNova account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl border border-gray-200/20 ${bgColor} ${textColor}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            Create Your MediNova Account
          </h2>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google-oauth2")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium 
              text-[#0D3B66] bg-white/50 backdrop-blur-md border border-gray-200/30 
              hover:bg-white/70 hover:scale-105 transition-all shadow-md"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium 
              text-white bg-[#1877F2] hover:bg-[#0D65D9] hover:scale-105 transition-all shadow-md"
            >
              <FaFacebook className="mr-2 h-5 w-5" /> Sign up with Facebook
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("twitter")}
              className="w-full flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium 
              text-white bg-[#1DA1F2] hover:bg-[#0D8DD9] hover:scale-105 transition-all shadow-md"
            >
              <FaTwitter className="mr-2 h-5 w-5" /> Sign up with Twitter
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-3 rounded-xl text-sm shadow-sm ${
                  darkMode ? "bg-[#0A2A43]/70" : "bg-white/60"
                }`}
              >
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Email/password Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {[
              { id: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { id: "password", label: "Password", type: "password", placeholder: "********" },
              { id: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "+92 300 1234567" },
              { id: "country", label: "Country", type: "text", placeholder: "Pakistan" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-semibold mb-1">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  className={inputGlass}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold mb-1">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date"
                className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-lg border border-gray-300/40 shadow-inner cursor-pointer dark:bg-[#0A2A43]/60"
                calendarClassName="bg-white/40 backdrop-blur-xl rounded-2xl border border-gray-300/30 shadow-xl dark:bg-[#0A2A43]/80"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold mb-1">
                Gender
              </label>
              <GlassSelect
                options={["Male", "Female", "Other"]}
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val })}
              />
            </div>

            <div className="flex items-center">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="h-4 w-4 text-[#00C2CB] focus:ring-[#00C2CB] border-gray-300 rounded"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm">
                I agree to the{" "}
                <a href="#" className="text-[#00C2CB] underline hover:text-[#0D3B66]">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl 
                text-white bg-gradient-to-r from-blue-600 to-blue-400 
                hover:scale-105 hover:shadow-lg transition-all"
              >
                Register
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* ✅ Success Notification */}
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
                <h3 className={`text-lg font-bold ${textColor}`}>Registration Successful ✅</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  Welcome, {formData.fullName}! Your account has been created.
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

      {/* ❌ Error Notification */}
      <AnimatePresence>
        {errorMessage && (
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
              <X className="w-6 h-6 text-red-500 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-600">Error ❌</h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mt-1`}>
                  {errorMessage}
                </p>
              </div>
              <motion.button
                onClick={() => setErrorMessage("")}
                className="p-1 rounded-full bg-red-200/40 hover:bg-red-300/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close notification"
              >
                <X className="w-5 h-5 text-red-500" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Register;
