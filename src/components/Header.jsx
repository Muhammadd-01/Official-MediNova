import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { DarkModeContext, AuthContext } from "../App";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const headerBg = "bg-white/30 dark:bg-[#0D3B66]/30 backdrop-blur-md";
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";

  const navItems = [
    "Home",
    "About",
    "Medicine Suggestion",
    "Consultation",
    "Articles",
    "News",
    "Emergency",
    "Contact",
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-300 ${headerBg} ${textColor}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className={`text-2xl font-extrabold tracking-wide hover:text-[#00C2CB] transition-all duration-300 ${textColor}`}
            >
              MediNova
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex flex-wrap items-center gap-2 ml-6">
              {navItems.map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-opacity-20 ${
                      darkMode
                        ? "text-white hover:bg-white"
                        : "text-[#0D3B66] hover:bg-[#0D3B66] hover:text-white"
                    }`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right-side Buttons */}
            <div className="flex items-center gap-2 ml-6">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="h-10 w-10 flex items-center justify-center rounded-full shadow-md bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <motion.button
                  onClick={logout}
                  className="h-10 px-4 text-sm font-semibold rounded-full shadow-md bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
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
                      className="h-10 px-4 text-sm font-semibold rounded-full shadow-md bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300 flex items-center"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="h-10 px-4 text-sm font-semibold rounded-full shadow-md bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300 flex items-center"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* 📱 Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${textColor}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 📱 Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden ${headerBg} ${textColor} backdrop-blur-lg transition-all duration-300`}>
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-5 py-2 rounded-full font-medium text-sm hover:bg-white/20 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-20 w-full"></div>
    </>
  );
}

export default Header;
