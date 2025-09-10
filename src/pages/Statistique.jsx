import React, { useState, useEffect } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import "./../styles/Statistique.css";

// Enregistrer les composants de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Statistique = () => {
    const [statsData, setStatsData] = useState({
        totalMpino: 0,
        fahatongavana: 0,
        mpinoVaovao: 0,
        mpinoMpitandrina: 0
    });

    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activePeriod, setActivePeriod] = useState('month');
    const [viewMode, setViewMode] = useState('charts');

    // Options pour les graphiques
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'var(--text-color)',
                    font: {
                        size: 12
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'var(--border-color)'
                },
                ticks: {
                    color: 'var(--text-color)'
                }
            },
            x: {
                grid: {
                    color: 'var(--border-color)'
                },
                ticks: {
                    color: 'var(--text-color)'
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'var(--text-color)',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    // Simuler le chargement des données
    useEffect(() => {
        const loadData = () => {
            // Données factices pour les mpino et fahatongavana
            const fahatongavanaData = {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                datasets: [
                    {
                        label: 'Fahatongavana',
                        data: [320, 370, 385, 410, 426, 456],
                        borderColor: 'var(--primary-color)',
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            };

            const mpinoData = {
                labels: ['Mpino Vaovao', 'Mpino Maharitra', 'Mpino Mpitandrina'],
                datasets: [
                    {
                        data: [35, 45, 20],
                        backgroundColor: [
                            'var(--primary-color)',
                            'var(--accent-color)',
                            'var(--secondary-color)'
                        ],
                        borderWidth: 0
                    }
                ]
            };

            const kariteData = {
                labels: ['Karite A', 'Karite B', 'Karite C', 'Karite D', 'Karite E'],
                datasets: [
                    {
                        label: 'Isan\'ny Mpino',
                        data: [75, 90, 60, 45, 85],
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: 4
                    }
                ]
            };

            setStatsData({
                totalMpino: 1244,
                fahatongavana: 456,
                mpinoVaovao: 35,
                mpinoMpitandrina: 20
            });

            setChartData({
                fahatongavana: fahatongavanaData,
                mpino: mpinoData,
                karite: kariteData
            });

            setIsLoading(false);
        };

        loadData();
    }, []);

    // Composant de carte statistique
    const StatCard = ({ title, value, change, icon }) => (
        <div className="stat-card" >
            <div className="stat-icon" >
                {icon}
            </div>
            <div className="stat-content">
                <h3>{title}</h3>
                <p className="stat-value">{value}</p>
                {change && <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </span>}
            </div>
        </div>
    );

    // Données factices pour le tableau
    const tableData = [
        { id: 1, karite: 'Karite A', isaMpino: 75, mpitandrina: 'Jean Dupont', daty: '15/07/2023' },
        { id: 2, karite: 'Karite B', isaMpino: 90, mpitandrina: 'Marie Lambert', daty: '22/06/2023' },
        { id: 3, karite: 'Karite C', isaMpino: 60, mpitandrina: 'Thomas Martin', daty: '30/07/2023' },
        { id: 4, karite: 'Karite D', isaMpino: 45, mpitandrina: 'Sophie Leroux', daty: '10/08/2023' },
        { id: 5, karite: 'Karite E', isaMpino: 85, mpitandrina: 'Pauline Bernard', daty: '05/07/2023' }
    ];

    if (isLoading) {
        return (
            <div className="statistics-container">
                <h1>Statistiques des Mpino sy Fahatongavana</h1>
                <div className="loading-spinner">Chargement des données...</div>
            </div>
        );
    }

    return (
        <div className="statistics-container">
            <h1>Statistiques des Mpino sy Fahatongavana</h1>

            {/* Contrôles */}
            <div className="stats-controls">
                <div className="period-selector">
                    <span>Période :</span>
                    <button
                        className={`period-btn ${activePeriod === 'week' ? 'active' : ''}`}
                        onClick={() => setActivePeriod('week')}
                    >
                        Semaine
                    </button>
                    <button
                        className={`period-btn ${activePeriod === 'month' ? 'active' : ''}`}
                        onClick={() => setActivePeriod('month')}
                    >
                        Mois
                    </button>
                    <button
                        className={`period-btn ${activePeriod === 'year' ? 'active' : ''}`}
                        onClick={() => setActivePeriod('year')}
                    >
                        Année
                    </button>
                </div>

                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'charts' ? 'active' : ''}`}
                        onClick={() => setViewMode('charts')}
                    >
                        Graphiques
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                    >
                        Tableau
                    </button>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="stats-grid">
                <StatCard
                    title="Total Mpino"
                    value={statsData.totalMpino.toLocaleString()}
                    change={12.5}
                    icon="👥"
                    color="var(--primary-color)"
                />
                <StatCard
                    title="Fahatongavana"
                    value={statsData.fahatongavana.toLocaleString()}
                    change={8.2}
                    icon="✝️"
                    color="var(--accent-color)"
                />
                <StatCard
                    title="Mpino Vaovao"
                    value={statsData.mpinoVaovao}
                    change={15.3}
                    icon="⭐"
                    color="var(--secondary-color)"
                />
                <StatCard
                    title="Mpino Mpitandrina"
                    value={statsData.mpinoMpitandrina}
                    change={5.7}
                    icon="🌟"
                    color="#6f42c1"
                />
            </div>

            {viewMode === 'charts' ? (
                /* Graphiques */
                <div className="charts-grid">
                    <div className="chart-container">
                        <h3>Fahatongavana isam-bolana</h3>
                        <div className="chart-wrapper">
                            {chartData.fahatongavana && <Line data={chartData.fahatongavana} options={chartOptions} />}
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3>Karazana Mpino</h3>
                        <div className="chart-wrapper">
                            {chartData.mpino && <Doughnut data={chartData.mpino} options={doughnutOptions} />}
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3>Mpino isam-karite</h3>
                        <div className="chart-wrapper">
                            {chartData.karite && <Bar data={chartData.karite} options={chartOptions} />}
                        </div>
                    </div>
                </div>
            ) : (
                /* Tableau de données */
                <div className="chart-container">
                    <h3>Mpino isam-karite</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Karite</th>
                                <th>Isan'ny Mpino</th>
                                <th>Mpitandrina</th>
                                <th>Daty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.karite}</td>
                                    <td>{item.isaMpino}</td>
                                    <td>{item.mpitandrina}</td>
                                    <td>{item.daty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Statistique;