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
    // "News",
    "Emergency",
    "Contact",
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-300 ${headerBg} ${textColor}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className={`text-2xl font-extrabold tracking-wide hover:text-[#00C2CB] transition-all duration-300 ${textColor}`}
            >
              MediNova
            </Link>

            {/* Desktop Nav */}
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

            {/* Right-side Buttons (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 ml-6">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="h-10 w-10 flex items-center justify-center rounded-full shadow-md bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>

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

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-md ${textColor}`}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Top-down) */}
        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full ${headerBg} ${textColor} backdrop-blur-lg transition-all duration-300`}>
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

              {/* Dark Mode Toggle (Mobile) */}
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-5 py-2 rounded-full font-medium text-sm bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300"
              >
                {darkMode ? <Moon size={18} className="mr-2" /> : <Sun size={18} className="mr-2" />}
                Toggle Dark Mode
              </button>

              {/* Auth Buttons (Mobile) */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-5 py-2 rounded-full font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-5 py-2 rounded-full font-medium text-sm bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center px-5 py-2 rounded-full font-medium text-sm bg-[#0D3B66] text-white hover:text-gray-300 transition-all duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20 w-full"></div>
    </>
  );
}

export default Header;
