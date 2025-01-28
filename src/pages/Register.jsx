import React, { useState, useContext } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext, DarkModeContext } from "../App"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { login } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // In a real application, you would create a new user account here
    login({ email })
    navigate("/")
  }

  return (
    <>
      <Helmet>
        <title>Register - MediCare</title>
        <meta name="description" content="Create a new MediCare account" />
      </Helmet>

      <div className={`max-w-md mx-auto ${darkMode ? "text-white" : "text-gray-800"}`}>
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Register
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <label htmlFor="email" className="block mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </motion.form>
      </div>
    </>
  )
}

export default Register

