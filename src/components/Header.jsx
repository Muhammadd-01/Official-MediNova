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
    <header
      className={`${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      } shadow-lg sticky top-0 z-50 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300">
            MediCare
          </Link>
          <nav className="hidden md:flex space-x-1">
            {["Home", "About", "Medicine Suggestion", "Consultation", "Articles", "News", "Emergency"].map((item) => (
              <motion.div key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } transition-colors duration-300`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-700"
              } transition-colors duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            {isAuthenticated ? (
              <motion.button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
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
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["Home", "About", "Medicine Suggestion", "Consultation", "Articles", "News", "Emergency"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-600 hover:text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                } transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

