import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBars, FaUsers, FaCalendarAlt, FaChurch, FaDonate, FaTasks, FaUserCog, FaCog,
    FaQuestionCircle, FaUserCircle, FaHome, FaMapMarkedAlt, FaPrayingHands, FaCross,
    FaCoins, FaUsersCog, FaSitemap, FaChartBar,
} from "react-icons/fa";
import useProfile from "../hooks/useProfile";
import "./../styles/Sidebar.css";

const Sidebar = () => {
    const { user, loading } = useProfile();
    const [sidebarActive, setSidebarActive] = useState(window.innerWidth >= 992);
    // Listener ho an'ny resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setSidebarActive(true); // Desktop → miseho foana
            } else {
                setSidebarActive(false); // Mobile/tablette → miafina default
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // mi-set initial state
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Add/remove class amin'ny body ho animation sy margin
    useEffect(() => {
        if (sidebarActive) {
            document.body.classList.add("sidebar-active");
        } else {
            document.body.classList.remove("sidebar-active");
        }
    }, [sidebarActive]);

    return (
        <>
        <aside className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="user-avatar"><FaUserCircle /></div>
              <div className="user-name">{loading ? "Chargement..." : user?.nom_user || "Utilisateur"}</div>
              <div className="user-role">{user?.role || "Role"}</div>
          </div>
        </div>
            
        <ul className="sidebar-menu">
          <li className="menu-title">Principal</li>
          <li className="menu-item">
            <Link to="/dashboard" className="menu-link"><FaHome /> Tableau de bord</Link>
          </li>
          <li className="menu-item">
            <Link to="/statistique" className="menu-link"><FaChartBar /> Statistique</Link>
          </li>
          <li className="menu-title">Gestion</li>
          <li className="menu-item"><Link to="/fiangonana" className="menu-link"><FaChurch /> Fiangonana</Link></li>
          <li className="menu-item"><Link to="/kartie" className="menu-link"><FaMapMarkedAlt /> Kartie</Link></li>
          <li className="menu-item"><Link to="/mpino" className="menu-link"><FaPrayingHands /> Mpino</Link></li>
          <li className="menu-item"><Link to="/mpitondra" className="menu-link"><FaCross /> Mpitondra</Link></li>
          <li className="menu-item"><Link to="/chefkartie" className="menu-link"><FaUsersCog /> Chef Kartie</Link></li>
          <li className="menu-item"><Link to="/fahatongavana" className="menu-link"><FaCalendarAlt /> Fahatongavana</Link></li>
          <li className="menu-item"><Link to="/vola" className="menu-link"><FaCoins /> Vola</Link></li>
          <li className="menu-item"><Link to="/komitie" className="menu-link"><FaUsers /> Komitie</Link></li>
          <li className="menu-item"><Link to="/sampana" className="menu-link"><FaSitemap /> Sampana</Link></li>
          <li className="menu-item"><Link to="/sampanamanaga" className="menu-link"><FaSitemap /> Sampana Managa</Link></li>
          <li className="menu-title">Administration</li>
          <li className="menu-item"><Link to="/utilisateur" className="menu-link"><FaUserCog /> Utilisateurs</Link></li>
          {/* <li className="menu-item"><Link to="/parametre" className="menu-link"><FaCog /> Paramètres</Link></li> */}
          <li className="menu-item"><Link to="aide_support" className="menu-link"><FaQuestionCircle /> Aide & Support</Link></li>
        </ul>
        </aside>
        <button className="sidebar-toggle" onClick={() => setSidebarActive(!sidebarActive)}>
                <FaBars />
        </button>

    </>
    );
};

export default Sidebar;
