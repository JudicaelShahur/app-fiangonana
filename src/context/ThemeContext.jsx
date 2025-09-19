import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
    // Jereo aloha raha misy theme voatahiry tao amin'ny localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    // Raha tsy misy voatahiry, jereo ny preference système
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    // Miantoka fa mitahiry ao amin'ny localStorage ny theme rehefa miova
    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
