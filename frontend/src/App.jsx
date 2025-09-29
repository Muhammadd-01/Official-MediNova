import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import MedicineSuggestion from "./pages/MediBot";
import Consultation from "./pages/Consultation";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Articles from "./pages/Articles";
import Pharmacy from "./pages/Pharmacy";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Emergency from "./pages/Emergency";
import BloodStreamBackground from "./components/BackgroundAnimation";
import Chatbot from "./components/Chatbot";
import GoToTop from "./components/GoToTop";
import Labs from "./pages/Labs";

// Contexts
export const DarkModeContext = React.createContext();
export const AuthContext = React.createContext();
export const CartContext = React.createContext(); // ✅ Add CartContext

// CartProvider Component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Set dark mode class on <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Auth logic
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <CartProvider> {/* ✅ Wrap app with CartProvider */}
          <HelmetProvider>
            <Router>
              <div className="flex flex-col min-h-screen relative">
                
                {/* ✅ Pass darkMode to the background animation */}
                <BloodStreamBackground darkMode={darkMode} />
                
                <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
                  <Header />

                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/medibot" element={<MediBot />} />
                      <Route path="/consultation" element={<Consultation />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/labs" element={<Labs />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/pharmacy" element={<Pharmacy />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/emergency" element={<Emergency />} />
                    </Routes>
                  </main>

                  <Footer />
                </div>

                <Chatbot />
                <GoToTop />
              </div>
            </Router>
          </HelmetProvider>
        </CartProvider>
      </DarkModeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
