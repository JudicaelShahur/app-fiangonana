import React, { useState } from "react";
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
    const { theme, toggleTheme } = useTheme();

    const { user } = useAuth();
    const { logout } = useLogout();
    const { membres, loading, refetch } = useMembresEnAttente();
    const { handleGererUser } = useGererUser(refetch);

    const toggleNotif = () => {
        setNotifActive(!notifActive);
        if (!notifActive) refetch(); // Re-fetch quand on ouvre la notification
    };

    const handleAction = async (membre, action) => {
        try {
            await handleGererUser(membre, action); // envoyer l'objet complet
            refetch(); // Re-fetch après action
        } catch (err) {

        }
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

                        <li className="navbar-item notification">
                            <span className="navbar-link" onClick={toggleNotif} style={{ cursor: "pointer" }}>
                                <FaBell />
                                {membres.length > 0 && <span className="badge">{membres.length}</span>}
                            </span>

                            {notifActive && (
                                <ul className="notif-dropdown">
                                    {loading ? (
                                        <li>Chargement...</li>
                                    ) : (
                                        membres.map((membre) => (
                                            <li key={membre.id} className="notif-item">
                                                <span>
                                                    {membre.nom_user} ({membre.role})
                                                </span>
                                                <div className="notif-actions">
                                                    <button
                                                        className="btn-accepter"
                                                        onClick={() => handleAction(membre, "confirmer")}
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        className="btn-supprimer"
                                                        onClick={() => handleAction(membre, "supprimer")}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
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
