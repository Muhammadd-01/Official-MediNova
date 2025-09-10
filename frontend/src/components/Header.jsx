import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Settings, LogIn, UserPlus, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext, AuthContext } from "../App";

// Animation variants for the dropdown
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

// Animation variants for mobile menu
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [spin, setSpin] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Dynamic classes for consistent theming
  const headerBg = "bg-white/50 dark:bg-[#0D3B66]/50 backdrop-blur-lg";
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";
  const hoverBg = darkMode ? "hover:bg-white/20" : "hover:bg-[#0D3B66]/20";

  // Navigation items
  const navItems = [
    "Home",
    "About",
    "Medicine Suggestion",
    "Consultation",
    "Articles",
    "Pharmacy",
    "Labs",
    "Emergency",
    "Contact",
  ];

  // Reset spin animation for settings icon
  useEffect(() => {
    if (spin) {
      const timer = setTimeout(() => setSpin(false), 600);
      return () => clearTimeout(timer);
    }
  }, [spin]);

  return (
    <>
      {/* Header with fixed positioning and responsive padding */}
      <header
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-300 ${headerBg} ${textColor}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className={`text-xl sm:text-2xl font-extrabold tracking-wide ${hoverBg} hover:text-[#00C2CB] transition-all duration-300 ${textColor}`}
            >
              MediNova
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
              {navItems.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className={`px-3 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${hoverBg} ${textColor}`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right-side Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 relative">
              {/* Settings Button with Spin Animation */}
              <motion.button
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setSpin(true);
                }}
                animate={{ rotate: spin ? 360 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`h-9 w-9 flex items-center justify-center rounded-full shadow-md bg-[#0D3B66] text-white ${hoverBg} transition-all duration-300`}
                aria-label="Settings"
              >
                <Settings size={18} />
              </motion.button>

              {/* Settings Dropdown */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-12 right-0 w-48 rounded-xl shadow-lg bg-white dark:bg-[#0D3B66] p-4 space-y-3 z-50"
                  >
                    {/* Dark Mode Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${hoverBg} transition-all duration-300`}
                    >
                      {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </motion.button>

                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </motion.button>
                    ) : (
                      <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to="/login"
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${hoverBg} bg-[#0D3B66] text-white transition-all duration-300`}
                          >
                            <LogIn size={16} />
                            <span>Login</span>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to="/register"
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium ${hoverBg} bg-[#0D3B66] text-white transition-all duration-300`}
                          >
                            <UserPlus size={16} />
                            <span>Register</span>
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${textColor}`}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`md:hidden absolute top-full left-0 w-full ${headerBg} ${textColor} backdrop-blur-lg`}
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item}
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className={`block px-5 py-2 rounded-full text-sm font-medium ${hoverBg} transition-colors duration-300`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}

                {/* Mobile Settings Section */}
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3 space-y-2">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-2 rounded-full text-sm font-medium ${hoverBg} bg-[#0D3B66] text-white transition-all duration-300`}
                  >
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>

                  {/* Auth Buttons */}
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 justify-center px-5 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 justify-center w-full px-5 py-2 rounded-full text-sm font-medium ${hoverBg} bg-[#0D3B66] text-white transition-all duration-300`}
                      >
                        <LogIn size={18} />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 justify-center w-full px-5 py-2 rounded-full text-sm font-medium ${hoverBg} bg-[#0D3B66] text-white transition-all duration-300`}
                      >
                        <UserPlus size={18} />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 w-full"></div>
    </>
  );
}

export default Header;