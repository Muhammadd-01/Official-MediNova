import React, { useContext, createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import BloodStreamBackground from "./components/BackgroundAnimation";

// Simple Notification Context
export const NotificationContext = createContext();
export const DarkModeContext = createContext(); // Mocking for Dashboard compatibility

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [darkMode, setDarkMode] = useState(true); // Default dark for admin

  // Simple toast implementation
  const showNotification = (msg, type) => {
    alert(`${type.toUpperCase()}: ${msg}`); // Replace with proper toast later
  };

  return (
    <Router>
      <AuthProvider>
        <NotificationContext.Provider value={{ showNotification }}>
          <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            <div className="relative min-h-screen">
              <BloodStreamBackground darkMode={darkMode} />
              <div className="relative z-10 pointer-events-auto">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </DarkModeContext.Provider>
        </NotificationContext.Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
