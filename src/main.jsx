import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/Layout.css";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode >
    <AuthProvider>
  <BrowserRouter>
    <ThemeProvider>
        <App />
    </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode >

);
