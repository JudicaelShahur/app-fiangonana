import React from "react";
import "../../styles/Dashboard.css";
import { useDashboard } from "../../hooks/useDashboard.jsx";
import { FaSearch } from "react-icons/fa";

const Dashboard = () => {
    const {
        activePeriod, setActivePeriod,
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        viewMode,
        stats,
        searchText, setSearchText,
        isDebouncing,
        filteredActivities,
        currentPage, totalPages, nextPage, prevPage, getPagesArray,
        loadingActivities,
        loadingStats,
    } = useDashboard();

    return (
        <div className="dashboard-container">
            <h1>Tableau de bord</h1>

            {/* Contrôles de période */}
            <div className="dashboard-controls">
                <div className="dashboard-period-selector">
                    <span>Période :</span>
                    {["week", "month", "year"].map(p => (
                        <button
                            key={p}
                            className={`dashboard-period-btn ${activePeriod === p ? "active" : ""}`}
                            onClick={() => setActivePeriod(p)}
                        >
                            {p === "week" ? "Semaine" : p === "month" ? "Mois" : "Année"}
                        </button>
                    ))}
                </div>

                <div className="dashboard-view-toggle">
                    {/* Dropdown mois si période = month */}
                    {activePeriod === "month" && (
                        <select
                            className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {[...Array(12).keys()].map(m => (
                                <option key={m + 1} value={m + 1}>
                                    {new Date(0, m).toLocaleString('fr-FR', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Dropdown année si période = month ou year */}
                    {(activePeriod === "month" || activePeriod === "year") && (
                        <select
                            className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
                            value={selectedYear}
                            onChange={e => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Statistiques */}
            <div className="dashboard-grid">
                {stats.map(stat => (
                    <div key={stat.id} className="dashboard-card">
                        <div className="dashboard-card-title">{stat.title}</div>

                        <div className="dashboard-card-value">
                            {loadingStats ? (
                                <div className="small-loader"></div> 
                            ) : (
                                stat.value
                            )}
                        </div>

                        {stat.icon}
                    </div>
                ))}
            </div>


            {/* Barre de recherche */}
            <div className="searchDashboard-bar">
                <div className="searchDashboard-input">
                    <FaSearch className="searchDashboard-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher une activité..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    {(isDebouncing || loadingActivities) && <div className="smallDashboard-loader"></div>}
                </div>
                <button className="filterDashboard-btn">
                    <i className="fas fa-filter"></i> Filtrer
                </button>
            </div>

            {/* Activités récentes */}
            <div className="dashboard-recent-activities">
                <h2>Activités récentes</h2>
                {loadingActivities ? (
                    
                        <div className="loader"></div>
                   
                ) : filteredActivities.length === 0 ? (
                    <p>Aucune activité trouvée</p>
                ) : (
                    <ul>
                        {filteredActivities.map(activity => {
                            const userName = activity.user || "Utilisateur inconnu";
                            return (
                                <li key={activity.id} className="dashboard-activity-item" data-action-type={activity.action}>
                                    <div className="activity-header">
                                        <strong>{userName}</strong>
                                        <span>a effectué une action</span>
                                        <em>{activity.action} {activity.target}</em>
                                    </div>

                                    {activity.meta && (
                                        <div className="activity-details">
                                            {activity.meta.old && (
                                                <div className="activity-old">
                                                    <strong>Ancien:</strong> {JSON.stringify(activity.meta.old)}
                                                </div>
                                            )}
                                            {activity.meta.new && (
                                                <div className="activity-new">
                                                    <strong>Nouveau:</strong> {JSON.stringify(activity.meta.new)}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <span className="activity-date">
                                        {new Date(activity.created_at).toLocaleString("fr-FR", {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Pagination
                <div className="paginationDashboard">
                    <button onClick={prevPage} disabled={currentPage <= 1}>Précédent</button>
                    {getPagesArray().map(p => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            style={{
                                backgroundColor: currentPage === p ? "#3498db" : "",
                                color: currentPage === p ? "#fff" : "",
                                borderRadius: "4px",
                                padding: "5px 10px",
                                margin: "0 2px",
                                border: "1px solid #ccc",
                                cursor: "pointer"
                            }}
                        >
                            {p}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage >= totalPages}>Suivant</button>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
