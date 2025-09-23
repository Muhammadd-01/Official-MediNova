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

  const bgColor = darkMode ? "bg-[#0A2A43]" : "bg-white bg-opacity-90 backdrop-blur-md";
  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";
  const inputDark = "border-[#395B75] bg-[#0A2A43] text-[#FDFBFB] placeholder-gray-300";
  const inputLight = "border-gray-300 bg-white text-[#0D3B66] placeholder-gray-500";

  return (
    <>
      <Helmet>
        <title>Register - MediNova</title>
        <meta name="description" content="Create a new MediNova account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-lg transition-all duration-300 ${bgColor} ${textColor}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center text-3xl font-extrabold">
            Create Your MediNova Account
          </h2>

          {/* Social buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-[#0D3B66] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3B66]"
            >
              <FcGoogle className="mr-2 h-5 w-5" /> Sign up with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-[#0D3B66] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3B66]"
            >
              <FaGithub className="mr-2 h-5 w-5" /> Sign up with GitHub
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("twitter")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium text-[#0D3B66] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3B66]"
            >
              <FaTwitter className="mr-2 h-5 w-5" /> Sign up with Twitter
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 rounded-md ${
                  darkMode ? "bg-[#0A2A43] text-[#FDFBFB]" : "bg-white text-[#0D3B66]"
                }`}
              >
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {[
              { id: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { id: "password", label: "Password", type: "password", placeholder: "********" },
              { id: "dateOfBirth", label: "Date of Birth", type: "date" },
              { id: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "+92 300 1234567" },
              { id: "country", label: "Country", type: "text", placeholder: "Pakistan" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 border rounded-xl sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66] ${
                    darkMode ? inputDark : inputLight
                  }`}
                  value={formData[field.id]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={`w-full px-4 py-3 border rounded-xl sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3B66] ${
                  darkMode ? inputDark : inputLight
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

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="h-4 w-4 text-[#0D3B66] focus:ring-[#0D3B66] border-gray-300 rounded"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm">
                I agree to the{" "}
                <a href="#" className="text-[#0D3B66] underline hover:text-[#00C2CB]">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-[#0D3B66] hover:bg-[#00C2CB] focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3B66] transition-all"
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
