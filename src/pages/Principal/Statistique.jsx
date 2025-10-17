import React from "react";
import useStatistique from "../../hooks/useStatistique.js";
import StatCard from "../Principal/StatCard";
import ChartsSection from "../Principal/ChartsSection";
import TableSection from "../Principal/TableSection";
import "../../styles/Statistique.css";

const Statistique = () => {
  const {
    statsData,
    chartData,
    // isLoading,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    activePeriod,
    setActivePeriod,
    viewMode,
    setViewMode,
    downloadQrCodeStats
  } = useStatistique();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "var(--text-color)", font: { size: 12 } },
      },
    },
    scales: {
      y: { ticks: { color: "var(--text-color)" }, grid: { color: "var(--border-color)" } },
      x: { ticks: { color: "var(--text-color)" }, grid: { color: "var(--border-color)" } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "var(--text-color)", font: { size: 12 } } },
    },
  };

  const tableData = statsData.mpinoParKartie?.map((item, index) => ({
    id: item.id,
    karite: item.nom_kar,
    isaMpino: item.total_mpino,
    percentage: item.percentage,
    daty: new Date().toLocaleDateString(), 
  })) || [];

//   if (isLoading) {
//     return (
//       <div className="statistics-container">
//         <h1>Statistiques des Mpino sy Fahatongavana</h1>
//         <div className="loading-spinner">Chargement des données...</div>
//       </div>
//     );
//   }

  return (
    <div className="statistics-container">
      <h1>Statistiques des Mpino sy Fahatongavana</h1>
      {/* Filtres */}
      <div className="stats-controls">
        <div className="period-selector">
          <span>Période :</span>
          {["week", "month", "year"].map((p) => (
            <button
              key={p}
              className={`period-btn ${activePeriod === p ? "active" : ""}`}
              onClick={() => setActivePeriod(p)}
            >
              {p === "week" ? "Semaine" : p === "month" ? "Mois" : "Année"}
            </button>
          ))}
        </div>

        <div className="view-toggle">
          {["charts", "table"].map((v) => (
            <button
              key={v}
              className={`view-btn ${viewMode === v ? "active" : ""}`}
              onClick={() => setViewMode(v)}
            >
              {v === "charts" ? "Graphiques" : "Tableau"}
            </button>
          ))}

        <div className="dashboard-view-toggle">
          {/* Sélecteur Mois : affiché SEULEMENT si activePeriod = "month" */}
          {activePeriod === "month" && (
            <>
              <select
               className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
              >
                {[...Array(12).keys()].map(m => (
                  <option key={m + 1} value={m + 1}>
                    {new Date(0, m).toLocaleString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </>
            )}
            {/* Sélecteur Année : toujours affiché */}
            <select
              className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {/* Bouton téléchargement QR Code */}
          <button
            className="btn-download-qrcode"
            onClick={() => downloadQrCodeStats()}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Télécharger QR Code Stats
          </button>
        </div>
       
      </div>


      {/* Cartes */}
      <div className="stats-grid">
        <StatCard title="Total Mpino" value={statsData.totalMpino.toLocaleString()} /*change={statsData.percentage_unique?.toFixed(1) || 0} */icon="👥" />
        <StatCard title="Fahatongavana" value={statsData.fahatongavana.toLocaleString()} change={statsData.average_percentage?.toFixed(1) || 0} icon="✝️" />
        <StatCard title="Mpino Vaovao" value={statsData.mpinoVaovao} change={statsData.percentageMpinoVaovao} icon="⭐" />
        <StatCard title="Mpino Mpandray" value={(statsData.totalMandray || 0).toLocaleString()} change={statsData.percentageMpandray||0} icon="🌟" />
      </div>

      {viewMode === "charts" ? (
        <ChartsSection chartData={chartData} chartOptions={chartOptions} doughnutOptions={doughnutOptions} />
      ) : (
        <TableSection tableData={tableData} />
      )}
    </div>
  );
};

export default Statistique;
