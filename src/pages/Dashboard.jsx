import React from "react";
import { FaUsers, FaChurch, FaCoins, FaCalendarAlt } from "react-icons/fa";
import "./../styles/Dashboard.css";
const Dashboard = () => {
    const stats = [
        { id: 1, title: "Nombre de membres", value: 120, icon: <FaUsers className="dashboard-card-icon" /> },
        { id: 2, title: "Églises", value: 8, icon: <FaChurch className="dashboard-card-icon" /> },
        { id: 3, title: "Dons reçus", value: "5 200 €", icon: <FaCoins className="dashboard-card-icon" /> },
        { id: 4, title: "Évènements à venir", value: 3, icon: <FaCalendarAlt className="dashboard-card-icon" /> },
    ];

    // ✅ Mamorona recentActivities dummy data
    const recentActivities = [
        { id: 1, user: "Jean", action: "a rejoint l'église", date: "2025-09-10 10:15" },
        { id: 2, user: "Marie", action: "a fait un don de 50 €", date: "2025-09-09 18:30" },
        { id: 3, user: "Paul", action: "a assisté à l'événement 'Prière du dimanche'", date: "2025-09-08 09:00" },
    ];

    return (
        <div className="dashboard-container">
            <h1>Tableau de bord</h1>
            <p>Bienvenue sur le tableau de bord.</p>

            <div className="dashboard-grid">
                {stats.map((stat) => (
                    <div key={stat.id} className="dashboard-card">
                        <div className="dashboard-card-title">{stat.title}</div>
                        <div className="dashboard-card-value">{stat.value}</div>
                        {stat.icon}
                    </div>
                ))}
            </div>

            <div className="recent-activities">
                <h2>Activités récentes</h2>
                {recentActivities.length === 0 ? (
                    <p>Aucune activité récente</p>
                ) : (
                    <ul>
                        {recentActivities.map((activity) => (
                            <li key={activity.id} className="activity-item">
                                <strong>{activity.user}</strong> {activity.action} <span className="activity-date">{activity.date}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
export default Dashboard;
