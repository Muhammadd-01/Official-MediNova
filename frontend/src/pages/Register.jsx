"use client";

import { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext, DarkModeContext } from "../App";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaTwitter } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
    gender: "",
    country: "",
    termsAccepted: false,
  });

  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert(res.data.msg);
      login({ email: formData.email });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error while registering ❌");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  return (
    <>
      <Helmet>
        <title>Register - MediNova</title>
        <meta name="description" content="Create a new MediNova account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg ${
            darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#003366]"
          }`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-extrabold">
            Create Your MediNova Account
          </h2>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-[#003366] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-[#003366] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
            >
              <FaGithub className="mr-2 h-5 w-5" /> Sign up with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("twitter")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-[#003366] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
            >
              <FaTwitter className="mr-2 h-5 w-5" /> Sign up with Twitter
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#003366]"}`}>
                Or sign up with email
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+92 300 1234567"
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                required
                placeholder="Pakistan"
                className={`w-full px-4 py-3 border rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  darkMode
                    ? "bg-[#0A2A43] text-[#FDFBFB] border-gray-500"
                    : "border-gray-300 text-[#003366]"
                }`}
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="h-4 w-4 text-[#003366] focus:ring-[#003366] border-gray-300 rounded"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label className="ml-2 text-sm">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-[#003366] underline hover:text-[#001933]"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-[#003366] hover:bg-[#001933] focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
              >
                Register
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Register;