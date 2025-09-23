import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Settings, LogIn, UserPlus, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext, AuthContext } from "../App";

// Animation variants
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

const settingsButtonVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 15, transition: { type: "spring", stiffness: 300, damping: 15 } },
  tap: { scale: 0.95, rotate: -15 },
  pulse: {
    scale: [1, 1.15, 1],
    rotate: [0, 180, 360],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Dynamic glass effect styles
  const headerBg =
    "bg-white/20 dark:bg-[#0D3B66]/30 backdrop-blur-xl border border-white/20 dark:border-[#00C2CB]/20 shadow-lg";
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";
  const hoverGlass =
    "transition-all duration-300 hover:bg-white/30 dark:hover:bg-[#00C2CB]/20 hover:shadow-lg hover:scale-105";

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

  useEffect(() => {
    if (pulse) {
      const timer = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${headerBg} ${textColor} rounded-b-2xl`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className={`text-xl sm:text-2xl font-extrabold tracking-wide px-4 py-2 rounded-full ${hoverGlass}`}
            >
              MediNova
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
              {navItems.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium ${hoverGlass}`}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right-side Controls */}
            <div className="hidden md:flex items-center gap-3 relative">
              {/* Settings Button */}
              <motion.button
                variants={settingsButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={pulse ? "pulse" : "initial"}
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setPulse(true);
                }}
                className={`h-10 w-10 flex items-center justify-center rounded-full bg-[#0D3B66] text-white border border-white/20 ${hoverGlass}`}
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
                    className="absolute top-12 right-0 w-52 rounded-2xl p-4 space-y-3 bg-white/30 dark:bg-[#0D3B66]/40 backdrop-blur-xl border border-white/20 shadow-xl"
                  >
                    {/* Dark Mode Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium ${hoverGlass}`}
                    >
                      {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </motion.button>

                    {/* Auth */}
                    {isAuthenticated ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm font-semibold bg-red-600/80 text-white hover:bg-red-700/90 transition-all"
                      >
                        <LogOut size={16} />
                        Logout
                      </motion.button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-full text-sm font-medium ${hoverGlass} bg-[#0D3B66]/80 text-white`}
                        >
                          <LogIn size={16} />
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-full text-sm font-medium ${hoverGlass} bg-[#0D3B66]/80 text-white`}
                        >
                          <UserPlus size={16} />
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${hoverGlass}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`md:hidden absolute top-full left-0 w-full ${headerBg}`}
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item}
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-5 py-2 rounded-full text-sm font-medium ${hoverGlass}`}
                  >
                    {item}
                  </Link>
                ))}

                {/* Mobile Settings */}
                <div className="border-t border-white/30 pt-3 space-y-2">
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-2 rounded-full text-sm font-medium ${hoverGlass} bg-[#0D3B66]/80 text-white`}
                  >
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 justify-center px-5 py-2 rounded-full text-sm font-semibold bg-red-600/80 text-white hover:bg-red-700/90"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 justify-center w-full px-5 py-2 rounded-full text-sm font-medium ${hoverGlass} bg-[#0D3B66]/80 text-white`}
                      >
                        <LogIn size={18} />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 justify-center w-full px-5 py-2 rounded-full text-sm font-medium ${hoverGlass} bg-[#0D3B66]/80 text-white`}
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

      {/* Spacer */}
      <div className="h-20 w-full"></div>
    </>
  );
}

export default Header;
