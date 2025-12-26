import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Ensure correct path
// Or import from App.jsx if exported there. In App.jsx AuthContext is exported.
// Better to import from App or move Context to separate file. 
// Based on file list, contexts/AuthContext.js does NOT exist separately, it is in App.jsx.
// But wait, App.jsx exports `AuthContext`.
// So I should import { AuthContext } from "../App";

function AdminRoute({ children }) {
    // We need to import AuthContext from App.jsx potentially
    // But circular dependencies might be annoying.
    // Ideally AuthProvider should be in its own file.
    // For now, let's assume I can import it.

    // NOTE: In App.jsx, AuthContext is exported.
}
