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
    activePeriod,
    setActivePeriod,
    viewMode,
    setViewMode,
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

  const tableData = [
    { id: 1, karite: "Karite A", isaMpino: 75, mpitandrina: "Judicael Shahur", daty: "15/07/2023" },
    { id: 2, karite: "Karite B", isaMpino: 90, mpitandrina: "Marie Daniel", daty: "22/06/2023" },
    { id: 3, karite: "Karite C", isaMpino: 60, mpitandrina: "Martin Lutherien", daty: "30/07/2023" },
  ];

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
