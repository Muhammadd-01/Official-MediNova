import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { DarkModeContext, AuthContext } from "../App"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { darkMode, setDarkMode } = useContext(DarkModeContext)
  const { isAuthenticated, logout } = useContext(AuthContext)

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900/60 backdrop-blur-md text-white"
            : "bg-white/60 backdrop-blur-md text-gray-900"
        } shadow-md`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-3xl font-extrabold tracking-wide text-blue-600 hover:text-blue-700 transition-all duration-300"
            >
              MediCare
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex space-x-3 items-center">
              {[
                "Home",
                "About",
                "Medicine Suggestion",
                "Consultation",
                "Articles",
                "News",
                "Emergency",
              ].map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md transition-colors duration-300 ${
                  darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-gray-800"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <motion.button
                  onClick={logout}
                  className="h-10 px-5 font-semibold rounded-full shadow-md bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="h-10 px-5 font-semibold rounded-full shadow-md bg-green-600 text-white hover:bg-green-700 transition-all duration-300 flex items-center"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="h-10 px-5 font-semibold rounded-full shadow-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 flex items-center"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div
            className={`md:hidden transition-all duration-300 ${
              darkMode ? "bg-gray-800/90 text-white" : "bg-white/90 text-gray-800"
            } backdrop-blur-md`}
          >
            <div className="px-4 py-4 space-y-2">
              {[
                "Home",
                "About",
                "Medicine Suggestion",
                "Consultation",
                "Articles",
                "News",
                "Emergency",
              ].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className={`block px-5 py-2 rounded-full font-medium text-sm transition-colors duration-300 ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer div to prevent content overlap */}
      <div className="h-20 w-full"></div>
    </>
  )
}

export default Header
