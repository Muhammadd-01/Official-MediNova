  "use client"

  import { useState, useContext } from "react"
  import { Helmet } from "react-helmet-async"
  import { useNavigate } from "react-router-dom"
  import { motion } from "framer-motion"
  import { AuthContext, DarkModeContext } from "../App"

  function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useContext(AuthContext)
    const { darkMode } = useContext(DarkModeContext)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
      e.preventDefault()
      // In a real application, you would validate credentials here
      login({ email })
      navigate("/")
    }

    return (
      <>
        <Helmet>
          <title>Login - MediNova</title>
          <meta name="description" content="Log in to your MediNova account" />
        </Helmet>

        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <motion.div
            className={`max-w-md w-full space-y-8 p-10 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
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
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                    } placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300 text-gray-900"
                    } placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </>
    )
  }

  export default Login

