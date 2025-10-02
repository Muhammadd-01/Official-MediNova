import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Sun,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext, AuthContext, CartContext } from "../App";
import CartSidebar from "./CartSidebar";

const MotionLink = motion(Link);

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

const logoVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95 },
};

const settingsButtonVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 15,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95, rotate: -15 },
  pulse: {
    scale: [1, 1.15, 1],
    rotate: [0, 180, 360],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const cartIconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    rotate: 15,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.9, rotate: -15 },
  pulse: {
    scale: [1, 1.2, 1],
    rotate: [0, 15, -15, 0],
    transition: { duration: 0.6 },
  },
};

// ✅ Profile animation (matches cartIconVariants exactly)
const profileIconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 15,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.9, rotate: -15 },
  pulse: {
    scale: [1, 1.2, 1],
    rotate: [0, 15, -15, 0],
    transition: { duration: 0.6 },
  },
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [profilePulse, setProfilePulse] = useState(false); // ✅ Keep for pulse on click
  const [cartOpen, setCartOpen] = useState(false);

  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const totalItems = cartContext?.totalItems || 0;

  const headerBg =
    "bg-white/20 dark:bg-[#0D3B66]/30 backdrop-blur-xl border border-white/20 dark:border-[#00C2CB]/20 shadow-lg";
  const textColor = darkMode ? "text-white" : "text-[#0D3B66]";
  const hoverGlass = `transition-all duration-300 hover:bg-white/30 dark:hover:bg-[#00C2CB]/20 hover:shadow-lg hover:scale-105 ${
    darkMode ? "" : "hover:text-[#0D3B66]"
  }`;

  const navItems = [
    "Home",
    "About",
    "MediBot",
    "Consultation",
    "Pharmacy",
    "Labs",
    "Articles",
    "Emergency",
    "Contact",
  ];

  useEffect(() => {
    if (pulse) {
      const timer = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [pulse]);

  useEffect(() => {
    if (cartPulse) {
      const timer = setTimeout(() => setCartPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartPulse]);

  useEffect(() => {
    if (profilePulse) {
      const timer = setTimeout(() => setProfilePulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [profilePulse]);

  const handleCartClick = () => {
    setCartOpen(true);
    setCartPulse(true);
  };

  // ✅ Handler for profile click to trigger pulse
  const handleProfileClick = () => {
    setProfilePulse(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${headerBg} ${textColor} rounded-b-2xl`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <MotionLink
              to="/"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={`text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide px-3 sm:px-4 py-2 rounded-full ${hoverGlass} min-w-max`}
            >
              MediNova
            </MotionLink>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className={`px-3 py-2 rounded-full text-sm font-medium ${hoverGlass} min-w-max`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Right-side Controls */}
            <div className="hidden lg:flex items-center gap-3 relative">
              {/* Cart Icon */}
              <motion.button
                onClick={handleCartClick}
                variants={cartIconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={cartPulse ? "pulse" : "initial"}
                className={`h-10 w-10 flex items-center justify-center rounded-full bg-white/30 dark:bg-[#0D3B66] ${
                  darkMode ? "text-white" : "text-[#0D3B66]"
                } border border-white/20 ${hoverGlass}`}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white font-bold">
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* ✅ Profile Icon (matches cart/settings behavior) */}
              {isAuthenticated && (
                <motion.div className="relative">
                  <MotionLink
                    to="/profile"
                    variants={profileIconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    animate={profilePulse ? "pulse" : "initial"}
                    onClick={handleProfileClick}
                    className={`h-10 w-10 flex items-center justify-center rounded-full bg-white/30 dark:bg-[#0D3B66] ${
                      darkMode ? "text-white" : "text-[#0D3B66]"
                    } border border-white/20 ${hoverGlass}`}
                  >
                    <User size={18} />
                  </MotionLink>
                </motion.div>
              )}

              {/* Settings */}
              <div className="relative">
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
                  className={`h-10 w-10 flex items-center justify-center rounded-full bg-white/30 dark:bg-[#0D3B66] ${
                    darkMode ? "text-white" : "text-[#0D3B66]"
                  } border border-white/20 ${hoverGlass}`}
                >
                  <Settings size={18} />
                </motion.button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-12 right-0 w-52 rounded-2xl p-4 space-y-3 bg-white/30 dark:bg-[#0D3B66]/40 backdrop-blur-xl border border-white/20 shadow-xl z-50"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium ${hoverGlass}`}
                      >
                        {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                        <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                      </motion.button>

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
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${hoverGlass}`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 sm:h-20 w-full"></div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Header;