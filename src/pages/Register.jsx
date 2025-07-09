"use client"

import { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext, DarkModeContext } from "../App"

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    termsAccepted: false,
  })
  const { login } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // In a real application, you would create a new user account here
    login({ email: formData.email })
    navigate("/")
  }

  return (
    <>
      <Helmet>
        <title>Register - MediNova</title>
        <meta name="description" content="Create a new MediNova account" />
      </Helmet>

      <div
        className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <motion.div
          className={`max-w-md w-full space-y-8 p-10 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="date-of-birth"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date of Birth
              </label>
              <input
                id="date-of-birth"
                name="dateOfBirth"
                type="date"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phoneNumber"
                type="tel"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                } placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4`}
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                id="terms-and-conditions"
                name="termsAccepted"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="terms-and-conditions"
                className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

