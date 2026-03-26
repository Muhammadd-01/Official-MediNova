import React, { useState, useEffect, useContext, createContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import axios from "axios";
import { Auth0ProviderWrapper } from "./components/Auth0ProviderWrapper";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import HealthBot from "./pages/HealthBot";
import Consultation from "./pages/Consultation";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Articles from "./pages/Articles";
import Pharmacy from "./pages/Pharmacy";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import BloodStreamBackground from "./components/BackgroundAnimation";
import Chatbot from "./components/Chatbot";
import GoToTop from "./components/GoToTop";
import Labs from "./pages/Labs";
import FAQ from "./components/FAQ";



// Contexts
export const DarkModeContext = createContext();
export const AuthContext = createContext();
export const CartContext = createContext();
export const NotificationContext = createContext();

// ---------------------- 🔔 Notification Provider ----------------------
function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const { darkMode } = useContext(DarkModeContext);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const cardBg = darkMode
    ? "bg-[#0A2A43]/70 backdrop-blur-lg border border-white/20"
    : "bg-white/60 backdrop-blur-lg border border-gray-200/40";

  const textColor = darkMode ? "text-[#FDFBFB]" : "text-[#0D3B66]";

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 z-50 w-full max-w-sm p-6 rounded-[20px] shadow-2xl ${cardBg}`}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            role="alert"
          >
            <div className="flex items-start">
              <AlertCircle
                className={`w-6 h-6 mr-3 ${notification.type === "error"
                  ? "text-teal-500"
                  : "text-green-500"
                  }`}
              />
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColor}`}>
                  {notification.type === "error" ? "⚠️ Error" : "✅ Success"}
                </h3>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"
                    } mt-1`}
                >
                  {notification.message}
                </p>
              </div>
              <motion.button
                onClick={() => setNotification(null)}
                className="p-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X
                  className={`w-5 h-5 ${notification.type === "error"
                    ? "text-teal-500"
                    : "text-green-500"
                    }`}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

// ---------------------- 👤 Auth Provider ----------------------
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------- 🛒 Cart Provider ----------------------
export function CartProvider({ children }) {
  const { user, isAuthenticated } = useContext(AuthContext) || {};
  const { showNotification } = useContext(NotificationContext) || {};
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/cart/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const backendItems = res.data.items.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        manufacturer: item.manufacturer,
        dosage: item.dosage,
        fdaId: item.fdaId,
      }));
      setCartItems(backendItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      showNotification &&
        showNotification("Failed to load cart items", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing)
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      else return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + (i.price || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------- 🔒 Protected Route ----------------------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const { showNotification } = useContext(NotificationContext);

  if (!token) {
    showNotification &&
      showNotification("Please login or register first to continue.", "error");
    return <Navigate to="/register" replace />;
  }
  return children;
}

// ---------------------- 🛡️ Admin Route REMOVED ----------------------

// ---------------------- 🌗 App Component ----------------------
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // ✅ Load theme immediately (avoids flicker)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved === "true") {
        document.documentElement.classList.add("dark");
        return true;
      }
    }
    return false;
  });

  // ✅ Persist changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <Auth0ProviderWrapper>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <HelmetProvider>
          <Router>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen relative">
                    <BloodStreamBackground darkMode={darkMode} />

                    <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
                      <Header />

                      <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                          {/* Public */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />

                          {/* Protected */}
                          <Route
                            path="/"
                            element={
                              <ProtectedRoute>
                                <Home />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/about"
                            element={
                              <ProtectedRoute>
                                <About />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/HealthBot"
                            element={
                              <ProtectedRoute>
                                <HealthBot />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/consultation"
                            element={
                              <ProtectedRoute>
                                <Consultation />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/feedback"
                            element={
                              <ProtectedRoute>
                                <Feedback />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/contact"
                            element={
                              <ProtectedRoute>
                                <Contact />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/labs"
                            element={
                              <ProtectedRoute>
                                <Labs />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/articles"
                            element={
                              <ProtectedRoute>
                                <Articles />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/pharmacy"
                            element={
                              <ProtectedRoute>
                                <Pharmacy />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/news"
                            element={
                              <ProtectedRoute>
                                <News />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/emergency"
                            element={
                              <ProtectedRoute>
                                <Emergency />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          {/* Admin Route */}
                          {/* Admin Route Removed */}
                        </Routes>
                      </main>

                      <Footer />
                    </div>

                    <Chatbot />
                    <GoToTop />
                  </div>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </Router>
        </HelmetProvider>
      </DarkModeContext.Provider>
    </Auth0ProviderWrapper>
  );
}

export default App;
