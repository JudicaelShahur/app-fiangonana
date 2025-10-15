import React from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "../../utils/chartSetup"; 

const ChartsSection = ({ chartData, chartOptions, doughnutOptions, activePeriod }) => {

  // Admin_appli : par fiangonana
  if (chartData.parFiangonana) {
    return (
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Présence par Fiangonana</h3>
          <div className="chart-wrapper">
            <Bar
              key="bar-parFiangonana"
              data={chartData.parFiangonana}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Comparaison des fiangonana" },
                },
                scales: {
                  y: { beginAtZero: true, max: 100, title: { display: true, text: "%" } },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-container">
          <h3>Karazana Mpino</h3>
          <div className="chart-wrapper">
            {chartData.mpino && (
              <Doughnut
                key={`doughnut-mpino-${activePeriod}`}
                data={chartData.mpino}
                options={doughnutOptions}
              />
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Mpino isam-karite</h3>
          <div className="chart-wrapper">
            {chartData.karite && (
              <Bar
                key={`bar-karite-${activePeriod}`}
                data={chartData.karite}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  //  Sinon : rendu classique
  return (
    <div className="charts-grid">
      <div className="chart-container">
        <h3>Fahatongavana isam-bolana</h3>
        <div className="chart-wrapper">
          {chartData.fahatongavana?.labels?.length > 0 ? (
            <Line
              key={`line-fahatongavana-${activePeriod}`}
              data={chartData.fahatongavana}
              options={chartOptions}
            />
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <h3>Karazana Mpino</h3>
        <div className="chart-wrapper">
          {chartData.mpino && (
            <Doughnut
              key={`doughnut-mpino-${activePeriod}`}
              data={chartData.mpino}
              options={doughnutOptions}
            />
          )}
        </div>
      </div>

      <div className="chart-container">
        <h3>Mpino isam-karite</h3>
        <div className="chart-wrapper">
          {chartData.karite && (
            <Bar
              key={`bar-karite-${activePeriod}`}
              data={chartData.karite}
              options={chartOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
