"use client"

import { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext, DarkModeContext } from "../App"

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
  })

  const { login } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions.")
      return
    }
    login({ email: formData.email })
    navigate("/")
  }

  return (
    <>
      <Helmet>
        <title>Register - MediNova</title>
        <meta name="description" content="Create a new MediNova account" />
      </Helmet>

      <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Create Your MediNova Account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+92 300 1234567"
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
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

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                placeholder="Pakistan"
                className={`w-full px-3 py-2 border rounded-md sm:text-sm focus:outline-none ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300 text-gray-900"
                }`}
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label htmlFor="termsAccepted" className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}

export default Register
