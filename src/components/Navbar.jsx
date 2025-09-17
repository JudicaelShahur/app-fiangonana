import React, { useState, useRef, useEffect } from "react";
import { FaChurch, FaBars, FaUserCircle, FaSignOutAlt, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { salutation } from "../utils/salutation";
import useLogout from "../hooks/useLogout";
import useMembresEnAttente from "../hooks/useMembresEnAttente";
import useGererUser from "../hooks/useGererUser";
import { useTheme } from "../context/ThemeContext";
import logoflm from "../assets/flmLogo.png";
import "./../styles/Navbar.css";

export default function Navbar() {
    const [menuActive, setMenuActive] = useState(false);
    const [notifActive, setNotifActive] = useState(false);
    const notifRef = useRef(null); // ref ho an'ny dropdown
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { logout } = useLogout();
    const { membres, loading, refetch } = useMembresEnAttente();
    const { handleGererUser } = useGererUser(refetch);

    // Toggle notification
    const toggleNotif = () => {
        setNotifActive(!notifActive);
        if (!notifActive) refetch();
    };

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = async (membre, action) => {
        try {
            await handleGererUser(membre, action);
            refetch();
        } catch (err) { }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logoflm} alt="" />
                <span>Fiangonana</span>
            </div>

            <button className="navbar-toggle" onClick={() => setMenuActive(!menuActive)}>
                <FaBars />
            </button>

            <ul className={`navbar-menu ${menuActive ? "active" : ""}`}>
                {user && (
                    <>
                        <li className="navbar-item">
                            <span className="navbar-link">
                                <FaUserCircle /> {salutation()}! {user.nom_user}
                            </span>
                        </li>

                        <li className="navbar-item notification" ref={notifRef}>
                            <span className="navbar-link" onClick={toggleNotif} style={{ cursor: "pointer" }}>
                                <FaBell />
                                {membres.length > 0 && <span className="badge">{membres.length}</span>}
                            </span>

                            {notifActive && (
                                <ul className="notif-dropdown">
                                    {loading ? (
                                        <li className="notif-loading">Chargement...</li>
                                    ) : membres.length === 0 ? (
                                        <li className="notif-empty">Aucune notification</li>
                                    ) : (
                                        membres.map((membre) => (
                                            <li key={membre.id} className="notif-item">
                                                <div className="notif-user">
                                                    <strong>{membre.nom_user}</strong> ({membre.role})
                                                </div>
                                                {membre.fiangonanas.map((fiang) => (
                                                    <div key={fiang.fiang_id} className="notif-actions">
                                                        <span className="fiang-name">{fiang.fiang_nom}</span>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-accepter"
                                                                onClick={() =>
                                                                    handleAction(
                                                                        { ...membre, fiang_id: fiang.fiang_id },
                                                                        "confirmer"
                                                                    )
                                                                }
                                                            >
                                                                Accepter
                                                            </button>
                                                            <button
                                                                className="btn-supprimer"
                                                                onClick={() =>
                                                                    handleAction(
                                                                        { ...membre, fiang_id: fiang.fiang_id },
                                                                        "supprimer"
                                                                    )
                                                                }
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </li>
                    </>
                )}

                <li className="navbar-item">
                    <a onClick={logout} className="navbar-link">
                        <FaSignOutAlt /> Déconnexion
                    </a>
                </li>
                <li className="navbar-item">
                    <a onClick={toggleTheme} className="theme-toggle">
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </a>
                </li>
            </ul>
        </nav>
    );
}
